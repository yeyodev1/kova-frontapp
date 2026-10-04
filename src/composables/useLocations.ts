import { ref } from 'vue'
import { storeService } from '@/services/store.service'
import type { City, Province } from '@/types'

// Cache de módulo: provincias y ciudades casi nunca cambian.
const provinces = ref<Province[]>([])
const citiesCache = new Map<number, City[]>()
let provincesPending: Promise<void> | null = null

export function useLocations() {
  const cities = ref<City[]>([])
  const loadingCities = ref(false)

  function loadProvinces(): Promise<void> {
    if (!provincesPending) {
      provincesPending = storeService
        .provinces()
        .then((data) => {
          provinces.value = [...data].sort((a, b) => a.name.localeCompare(b.name, 'es'))
        })
        .catch((error) => {
          provincesPending = null
          throw error
        })
    }
    return provincesPending
  }

  async function loadCities(provinceId: number): Promise<void> {
    if (!provinceId) {
      cities.value = []
      return
    }
    const cached = citiesCache.get(provinceId)
    if (cached) {
      cities.value = cached
      return
    }
    loadingCities.value = true
    try {
      const data = await storeService.cities(provinceId)
      const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name, 'es'))
      citiesCache.set(provinceId, sorted)
      cities.value = sorted
    } finally {
      loadingCities.value = false
    }
  }

  return { provinces, cities, loadingCities, loadProvinces, loadCities }
}

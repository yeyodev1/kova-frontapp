<template>
  <div class="sk" aria-hidden="true">
    <div class="sk__media"></div>
    <div class="sk__body">
      <div class="sk__line skeleton"></div>
      <div class="sk__line sk__line--mid skeleton"></div>
      <div class="sk__line sk__line--price skeleton"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Misma silueta que ProductCard: marco blanco, peana y tres líneas.
.sk {
  @include flex(column, stretch, flex-start);
  padding: 0.35rem;
  background: $surface;
  border: 1px solid rgba($line, 0.8);
  border-radius: 20px;

  &__media {
    @include plinth(16px);
    aspect-ratio: 1 / 1;

    // Shimmer con transform: una franja de luz que cruza la peana vacía.
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      width: 60%;
      background: linear-gradient(100deg, transparent, rgba(#fff, 0.75), transparent);
      transform: translateX(-120%);
      animation: sk-shimmer 1.5s $ease-out infinite;
    }
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.45rem);
    padding: 0.8rem 0.45rem 0.6rem;
  }

  &__line {
    height: 0.8rem;
    border-radius: 6px;

    &--mid {
      width: 70%;
    }

    &--price {
      width: 42%;
      height: 1.05rem;
      margin-top: 0.2rem;
    }
  }

  @include reduced-motion {
    &__media::after {
      animation: none;
      opacity: 0;
    }
  }
}

@keyframes sk-shimmer {
  to {
    transform: translateX(220%);
  }
}
</style>

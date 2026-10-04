<template>
  <div class="sk" aria-hidden="true">
    <div class="sk__media skeleton"></div>
    <div class="sk__line skeleton"></div>
    <div class="sk__line sk__line--short skeleton"></div>
  </div>
</template>

<style scoped lang="scss">
.sk {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__media {
    aspect-ratio: 1 / 1;
    border-radius: 14px;
  }

  &__line {
    height: 0.9rem;

    &--short {
      width: 55%;
    }
  }
}
</style>

<template>
  <div class="psk" aria-busy="true" aria-label="Cargando producto">
    <div class="psk__media skeleton"></div>
    <div class="psk__info">
      <div class="psk__line psk__line--title skeleton"></div>
      <div class="psk__line psk__line--short skeleton"></div>
      <div class="psk__line psk__line--price skeleton"></div>
      <div class="psk__block skeleton"></div>
      <div class="psk__block skeleton"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.psk {
  @include flex(column, stretch, flex-start, 1.25rem);

  @include from('md') {
    flex-direction: row;
  }

  &__media {
    aspect-ratio: 1 / 1;
    flex: 1;
    margin-inline: -1.25rem;
    border-radius: 0;

    @include from('md') {
      margin-inline: 0;
      border-radius: $radius-md;
    }
  }

  &__info {
    flex: 1;
    @include flex(column, stretch, flex-start, 0.8rem);
  }

  &__line {
    height: 1.1rem;

    &--title {
      height: 1.8rem;
    }

    &--short {
      width: 50%;
    }

    &--price {
      height: 2.2rem;
      width: 40%;
    }
  }

  &__block {
    height: 3.4rem;
  }
}
</style>

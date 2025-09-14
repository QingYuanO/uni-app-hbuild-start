<script setup lang="ts">

onLoad(() => {




});
</script>

<style src="./styles/theme.css"></style>

<style lang="scss">
@import './styles/tailwind.css';

@import './styles/theme.css';

/* #ifdef H5 */
.uni-modal {
	border-radius: 10px;
}

.uni-modal__hd {
	text-align: start;
}

.uni-modal__ft:after,
.uni-modal__btn:after {
	border: none;
}

/* #endif */
</style>

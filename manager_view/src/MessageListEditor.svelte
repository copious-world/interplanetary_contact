<script>

	import * as ipfs_profiles from './ipfs_profile_proxy.js'

	export let message_edit_list;


	function convert_date(secsdate) {
		if ( secsdate === 'never' ) {
			return 'never';
		} else {
			let idate = parseInt(secsdate)
			let dformatted = (new Date(idate)).toLocaleDateString('en-US')
			return (dformatted)
		}
	}

	let c_index = 0
	let categories = [
		{
			"name" : "don't move"
		},
		{
			"name" : "read"
		},
		{
			"name" : "events"
		},
		{
			"name" : "friends"
		},
		{
			"name" : "work"
		},
		{
			"name" : "accounts"
		},
		{
			"name" : "bills"
		},
		{
			"name" : "official"
		}
	]

	function do_delete() {

	}

	function do_move() {

	}

</script>
 
<div class="blg-el-wrapper-full">
	<div style="padding:6px;" >
		<button style="background-color:darkgreen" on:click={do_delete}>delete</button>
		<button style="background-color: yellowgreen" on:click={do_move}>move to</button>
		<select bind:value={c_index} style="text-align:center;" >
			{#each categories as cat, c_index }
				<option value={c_index}>{cat.name}</option>
			{/each}
		</select>
	</div>
</div>

<style>

	.blg-el-wrapper-full {
		overflow-y: hidden;
		height:inherit;
	}
	button {
		display: inline-block;
		padding: 0.2em 0.5em;
		margin: 0 0.2em 0.2em 0;
		text-align: center;
		border-radius: 0.2em;
		color: white;
	}

	.blg-item-title {
		color:black;
		display: unset;
		border-bottom: 1px darkslateblue solid;
	}

	.blg-item-subject {
		color:black;
		display: unset;
	}

	h6 {
		background-color: rgb(245, 245, 245);
		border: 1px black solid;
		border-radius: 0.2em;
		padding: 0.2em 0.5em;
		margin: 0 0.2em 0.2em 0;
		color:black;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		width: 200px;
	}
</style>
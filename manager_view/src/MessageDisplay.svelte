<script>

	// `current` is updated whenever the prop value changes...
	export let name;
	export let subject;
	export let date;
	export let readers;
	export let business;
	export let public_key;
	export let message;


	function do_reply() {
		alert(subject)
	}

</script>
 
<div class="blg-el-wrapper-full" >
	<div style="padding:6px;" >
		<span style="background-color: yellowgreen">{date}</span>
		<h4 class="blg-item-title" style="background-color: inherit;">{name}</h4>
		<div>
			<div class="little-info">
				{name} is a { business ? "business" : "person" }
			</div>
			<button on:click={do_reply} >Reply</button>
		</div>
		<div>
			<span style="background-color:navy">Sent to:</span>&nbsp;&nbsp;{readers}
		</div>
		<div>
			<span style="background-color:navy">subject</span>&nbsp;&nbsp;{subject}
		</div>
	</div>
	<span>Compose message here</span>
	<div id="blg-window-full-text"  class="full-display" >
		{@html message}
	</div>
	<input type="hidden" id="pub-key" bind:value={public_key} />
</div>

<style>

	.blg-el-wrapper-full {
		overflow-y: hidden;
		height:inherit;
	}
	span {
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


	.full-display {
		background-color: rgba(255, 255, 255, 0.9);
		color: rgb(73, 1, 1);
		border-top: solid 2px rgb(88, 4, 88);
		padding: 6px 4px 6px 4px;
		overflow-y: scroll;
		height: 100px;
		border-bottom: solid 1px rgb(88, 4, 88);
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

	.little-info {
		font-size: 0.87em;
		display: inline-block;
	}
</style>
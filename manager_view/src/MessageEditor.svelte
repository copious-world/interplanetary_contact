<script>

	// `current` is updated whenever the prop value changes...
	export let name;
	export let place_of_origin;
	export let cool_public_info;
	export let business;
	export let public_key;
	export let answer_message


	let todays_date = ''
	$: 	{
		todays_date = (new Date()).toISOString()
	}

	let contact_page = ""

	let b_label = ""
	let know_of = ""
	$: b_label = business ? " is a business" : " is a person"
	$: know_of = (public_key !== false) ? " is someone I know" : " is a new introduction"

	let has_previous = (answer_message && (typeof answer_message === "string") && answer_message.length)


	function convert_date(secsdate) {
		if ( secsdate === 'never' ) {
			return 'never';
		} else {
			let idate = parseInt(secsdate)
			let dformatted = (new Date(idate)).toLocaleDateString('en-US')
			return (dformatted)
		}
	}

	async function start_composing() {
		let b_or_p =  ( business ) ? "business" : "profile"
		let srver = location.host
		srver = srver.replace('5111','6111')
		let prot = location.protocol  // prot for (prot)ocol
		let data_stem = 'contact_form'
		let sp = '//'
		let post_data = {
			"name" : name,
			"place_of_origin" : encodeURIComponent(place_of_origin),
			"cool_public_info" : encodeURIComponent(cool_public_info)
		}

		let search_result = await postData(`${prot}${sp}${srver}/${data_stem}/${b_or_p}`, post_data)
		if ( search_result ) {
			let data = search_result;
			if ( data ) {
				//
				let html = data.html
				contact_page = decodeURIComponent(html)
				let script = data.script
				script = decodeURIComponent(script)
				addscript(script,"blg-window-full-text-outgo-script",true)
				//
			}
		}
	}

</script>
 
<div class="blg-el-wrapper-full" >
	<div style="padding:6px;" >
		<span style="background-color: yellowgreen">{todays_date}</span>
		<span class="message_indicator">Sending a message to:</span>
		<div>
			<span class="name">{name},</span>
			<span class="about_name">who {b_label} and {know_of}.</span>	
		</div>
		<div class="cool-stuff">
			{name} comes from {place_of_origin} and wants you to know that: &quot;{cool_public_info}&quot;
		</div>
	</div>

	{#if has_previous }
	<span class="large-text-label" >Previous Message:</span>
	<div id="blg-window-full-text-outgo"  class="full-display" >
		{@html answer_message}
	</div>
	{/if}
	<span class="large-text-label" >Compose message here:</span> <button class="medium_button" on:click={start_composing}>begin compositions</button>
	<div id="blg-window-full-text-outgo"  class="full-display-bottom" >
		{@html contact_page}
	</div>
	<div id="blg-window-full-text-outgo-script" class="is-nothing" ></div>
	<input type="hidden" id="pub-key-outgo" bind:value={public_key} />
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

	.full-display-bottom {
		background-color: rgba(255, 255, 255, 0.9);
		color: rgb(73, 1, 1);
		border-top: solid 2px rgb(88, 4, 88);
		padding: 6px 4px 6px 4px;
		overflow-y: scroll;
		height: calc(80vh - 260px);
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

	.message_indicator {
		color:rgb(2, 32, 21);
		font-weight: bold;
	}
	.name {
		font-weight: bold;
		font-size: x-large;
		color:rgb(71, 15, 29);
	}
	.about_name {
		color:rgb(88, 4, 88);
	}
	.cool-stuff {
		font-weight: bold;
		color:rgb(29, 73, 75);
	}

	.large-text-label {
		color:rgb(36, 2, 2)
	}

	.medium_button {
		width:25%;
	}

	.is-nothing {
		display: none;
		visibility: hidden;
	}
</style>
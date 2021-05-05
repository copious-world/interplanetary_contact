<script>
	import { onMount } from 'svelte';

	// `current` is updated whenever the prop value changes...
	export let name;
	export let place_of_origin;
	export let cool_public_info;
	export let business;
	export let public_key;
	export let answer_message


	import * as ipfs_profiles from './ipfs_profile_proxy.js'

	let message_type = "introduction"
	let receiver_user_info = {
			"name" : name,
			"place_of_origin" : place_of_origin,
			"cool_public_info" : cool_public_info,
			"business" : business,
			"public_key" : public_key,
			"name" : name
		}

	let r_cid = false
	let r_p_cid = false 

	$: {
		receiver_user_info = {
			"name" : name,
			"place_of_origin" : place_of_origin,
			"cool_public_info" : cool_public_info,
			"business" : business,
			"public_key" : public_key
		}
		r_cid = ipfs_profiles.fetch_contact_cid(receiver_user_info)  // established contact
		delete receiver_user_info.public_key
		r_p_cid = ipfs_profiles.fetch_contact_cid(receiver_user_info)	// introduction or no privacy intended
	}

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


	async function start_introduction() {
		//
		let contact_page_descr = await ipfs_profiles.fetch_contact_page('default',r_p_cid)
		if ( contact_page_descr ) {
			let html = contact_page_descr.html
			contact_page = decodeURIComponent(html)
			let script = contact_page_descr.script
			script = decodeURIComponent(script)
			script = script.replace("{{when}}",Date.now())
			addscript(script,"blg-window-full-text-outgo-script",true)
		}
		//
	}


	async function start_composing() {
		//
		let contact_page_descr = await ipfs_profiles.fetch_contact_page('cid',r_cid)
		if ( contact_page_descr ) {
			let html = contact_page_descr.html
			contact_page = decodeURIComponent(html)
			let script = contact_page_descr.script
			script = decodeURIComponent(script)
			script = script.replace("{{when}}",Date.now())
			addscript(script,"blg-window-full-text-outgo-script",true)
		}
		//
	}

	// // // // // // 
	//
	async function ipfs_sender(message) {
		switch ( message_type ) {
			case "introduction" : {
				let identify = ipfs_profiles.get_current_identity()
				if ( identify ) {
					let user_info = identify.user_info
					await ipfs_profiles.send_introduction(receiver_user_info,user_info,message)

				}
				break;
			}
			default: {
				let identify = ipfs_profiles.get_current_identity()
				if ( identify ) {
					let user_info = identify.user_info
					await ipfs_profiles.send_message(receiver_user_info,user_info,message)

				}
				break;
			}
		}
	}
	
	//
	onMount(() => {
		if ( window._app_set_default_message_sender !== undefined ) {
			window._app_set_default_message_sender(ipfs_sender)
		}
	})

	

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
	<span class="large-text-label" >Compose message here:</span> 
	<button class="medium_button" on:click={start_composing}>begin compositions</button>
	<button class="medium_button" on:click={start_introduction}>begin introduction</button>
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
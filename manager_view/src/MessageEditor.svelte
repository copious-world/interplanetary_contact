<script>
	import { onMount } from 'svelte';

	// `current` is updated whenever the prop value changes...
	export let name;
	export let DOB;
	export let place_of_origin;
	export let cool_public_info;
	export let business;
	export let public_key;
	export let answer_message		// boolean
	export let cid

	export let reply_to;	// the source message
	export let active_identity

	export let encrypting = false
	export let selected_contact_cid = 'default'

	import * as ipfs_profiles from './ipfs_profile_proxy.js'
	import * as utils from './utilities.js'


	let show_key = false
	let introduction = false

	let attachments = []

	let message_type = "introduction"
	let receiver_user_info = {
			"name" : name,
			"DOB" : DOB,
			"place_of_origin" : place_of_origin,
			"cool_public_info" : cool_public_info,
			"business" : business,
			"public_key" : public_key,
			"name" : name
		}

	// "name": 'Hans Solo', "user_cid" : "4504385938", 
	// "subject" : "Darth Vadier Attacks", "date" : todays_date, "readers" : "joe,jane,harry",
	// "business" : false, "public_key" : false, "message" : "this is a message 1"

	let conmmon_contact_vars = {
		"{{contact-top}}" : utils.cvar_factory("promail-mes-ed-contact",''),
		"{{id-to-" : utils.cvar_factory("promail-recipient","name"),
		"{{id-cid-" : utils.cvar_factory("promail-recipient","user_cid"),
		"{{id-date-" : utils.cvar_factory("promail-date","date"),
		"{{id-cc-" : utils.cvar_factory("promail-readers","readers"),
		"{{id-business-" : utils.cvar_factory("promail-business","business"),
		"{{id-subject-" : utils.cvar_factory("promail-subject"),
		"{{id-message-" : utils.cvar_factory("promail-message"),
		"{{id-sender_key-" : utils.cvar_factory("promail-sender_key","public_key"),
		"{{id-wrapped_key-" : utils.cvar_factory("promail-wrapped_key","wrapped_key"),
		"{{id-attached-" : utils.cvar_factory("promail-attachments","attachments"),
	}


	let cform_var_supply = {
		"{{to}}" : name,
		"{{DOB}}" : DOB,
		"{{date}}" : (new Date()).toISOString(),
		"{{place_of_origin}}" : place_of_origin,
		"{{cool_public_info}}" : cool_public_info,
		"{{business}}" : business ? "business" : "profile",
		"{{public_key}}" : JSON.stringify(public_key),
		"{{cid}}" : JSON.stringify(active_identity.cid),
		"{{from}}" : active_identity.user_info ? active_identity.user_info.name : "",
		"{{clear_cid}}" : JSON.stringify(active_identity.clear_cid)
	}

	// "name": 'Hans Solo', "user_cid" : "4504385938", 
	// "subject" : "Darth Vadier Attacks", "date" : todays_date, "readers" : "joe,jane,harry",
	// "business" : false, "public_key" : false, "message" : "this is a message 1"
	function message_object_on_send() {
		let message_object = {
			"name" : active_identity.user_info.name,
			"user_cid" : active_identity.cid,
			"subject" : conmmon_contact_vars["{{id-subject-"].extract_value(),
			"date" : Date.now(),
			"readers" : conmmon_contact_vars["{{id-cc-"].extract_value(),
			"business" : business,
			"public_key" : active_identity.user_info.public_key,
			"message" :  conmmon_contact_vars["{{id-message-"].extract_value(),
			"attachments" : attachments,
			"reply_with" : selected_contact_cid
		}

		let message = message_object

		if ( !(introduction) && encrypting ) {
			if ( encrypting ) {
				message = {
					"name" : active_identity.user_info.name,
					"user_cid" : active_identity.cid
				}
				let [wrapped, aes_key] = get_wrapped_aes_key(public_key)  // recipient's public wrapper key
				message.wrapped_key = wrapped
				message.ctext = get_encipherd_message(JSON.stringify(message_object),aes_key)
			}
		}

		return(message)
	}

	async function init_contact_form_cids(r_info) {
		r_cid =  await ipfs_profiles.fetch_contact_cid(r_info,false)  // established contact
		r_p_cid = await ipfs_profiles.fetch_contact_cid(r_info,true)	// introduction or no privacy intended
	}

	let r_cid = false		// receiver's private contact cid
	let r_p_cid = false 	// receiver's public contact cid
	//
	let user_cid = false	// the active user cid of sender (user of client)
							// This is for retreiving keys, encryptors, etc. out of local storage

	$: user_cid = active_identity.cid

	$: {
		receiver_user_info = {
			"name" : name,
			"DOB" : DOB,
			"place_of_origin" : place_of_origin,
			"cool_public_info" : cool_public_info,
			"business" : business,
			"public_key" : public_key
		}

		init_contact_form_cids(receiver_user_info)
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

	function toggle_showkey() {
		show_key = show_key ? false : true
		console.log(show_key)
	}


	let previous_message = ""
	$: previous_message = answer_message ? JSON.stringify(reply_to,null,4) : ""


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
		introduction = true
		//
		// the user cid (active identity) gets any services for handling encryption locally.
		// The receiver information will be stored as part of the data if encryption is required
		let contact_page_descr = await ipfs_profiles.fetch_contact_page(user_cid,'default',r_p_cid)
		if ( contact_page_descr ) {
			let html = (contact_page_descr.html === undefined) ? contact_page_descr.txt_full : contact_page_descr.txt_full
			contact_page = html // decodeURIComponent(html)
			//
			let script = contact_page_descr.script
			script = decodeURIComponent(script)
			script = script.replace("{{when}}",Date.now())
			addscript(script,"blg-window-full-text-outgo-script",true)
		}
		//
	}


	async function start_composing() {
		introduction = false
		//
		// the user cid (active identity) gets any services for handling encryption locally.
		// The receiver information will be stored as part of the data if encryption is required
		let contact_page_descr = await ipfs_profiles.fetch_contact_page(user_cid,'cid',r_cid)
		if ( contact_page_descr ) {
			let html = (contact_page_descr.html === undefined) ? contact_page_descr.txt_full : contact_page_descr.txt_full
			contact_page = html // decodeURIComponent(html)
			//
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
				let identify = active_user
				if ( identify ) {
					let user_info = identify.user_info
					await ipfs_profiles.send_introduction(receiver_user_info,user_info,message)
				}
				break;
			}
			default: {
				let identify = active_user
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


	function drop(ev) {
		ev.preventDefault();
		if ( ev.dataTransfer.items ) {
			// Use DataTransferItemList interface to access the file(s)
			for (let i = 0; i < ev.dataTransfer.items.length; i++) {
				if (ev.dataTransfer.items[i].kind === 'file') {
					let file = ev.dataTransfer.items[i].getAsFile();
					let fname = file.name
					let mtype = file.mime_type
					var reader = new FileReader();
						reader.onload = async (e) => {
							let blob64 = e.target.result
							let fcid = ipfs_profiles.upload_data_file(blob64)
							attachments.push(fcid)
							conmmon_contact_vars["{{id-attached-"].set_el_hmtl(attachments.join(','))
						};
						reader.readAsDataURL(file)
					break
				}
			}
		} else {
			// Use DataTransfer interface to access the file(s)
			for (let i = 0; i < ev.dataTransfer.files.length; i++) {
				let file = ev.dataTransfer.files[i].getAsFile();
				let fname = file.name
				reader.onload = (e) => {
					let blob64 = e.target.result
					let fcid = ipfs_profiles.upload_data_file(blob64)
					attachments.push(fcid)
				};
				reader.readAsDataURL(file)
				break
			}
		}
	}


	function dragover(event) {
		ev.preventDefault();
	}




</script>
 
<div class="blg-el-wrapper-full" >
	<div style="padding:6px;" >
		<span class="cool-label" style="background-color: yellowgreen">{todays_date}</span>
		<span class="message_indicator">Sending a message to:</span>
		<div>
			<span class="name">{name},</span>
			<span class="about_name">who {b_label} and {know_of}.</span>	
		</div>
		<div class="cool-stuff">
			{name} comes from {place_of_origin} and wants you to know that: &quot;{cool_public_info}&quot;
		</div>
		<div>
			Requesting response through contact form <span> <span style="font-weight: bold;">{selected_contact_cid}</span>
		</div>
	</div>

	{#if answer_message }
	<span class="large-text-label" >Previous Message:</span>
	<div id="blg-window-full-text-outgo"  class="full-display" >
		{@html previous_message}
	</div>
	{/if}
	<span class="large-text-label" >Compose message here:</span>
	<button class="medium_button" on:click={start_composing}>begin compositions</button>
	<button class="medium_button" on:click={start_introduction}>begin introduction</button>
	<span class="add-attachemnt" on:drop={drop} on:dragover={dragover} >Drop attachment here (&#128206;)</span>
	<div id="blg-window-full-text-outgo"  class="full-display-bottom" >
		{@html contact_page}
	</div>
	<div id="blg-window-full-text-outgo-script" class="is-nothing" ></div>
	<div style="background-color:whitesmoke;font-weight: 600;font-size: smaller;">
		<span style="font-weight:bold;color:black">contact cid:</span> {cid} 
		{#if !(show_key) }
			<button style="float:right" on:click={toggle_showkey}>(▼)</button>
		{:else}
			<button style="float:right" on:click={toggle_showkey}>(^)</button>
		{/if}
	</div>
	{#if show_key }
	<div class="viz-key" style="background-color:whitesmoke;font-weight: 600;font-size: smaller;">
		<span style="font-weight:bold;color:black">public wrapper key:</span> {public_key}
	</div>
	{:else}
	<div class="hide-key" style="background-color:whitesmoke;font-weight: 600;font-size: smaller;">
		<span style="font-weight:bold;color:black">public wrapper key:</span> {public_key}
	</div>
	{/if}
</div>
<style>

	.blg-el-wrapper-full {
		overflow-y: hidden;
		height:inherit;
	}


	.cool-label {
		display: inline-block;
		padding: 0.2em 0.5em;
		margin: 0 0.2em 0.2em 0;
		text-align: center;
		border-radius: 0.2em;
		color: white;
	}


	.add-attachemnt {
		display: inline-block;
		padding: 0.2em 0.5em;
		margin: 0 0.2em 0.2em 0;
		text-align: center;
		border-radius: 0.2em;
		color: rgb(19, 68, 6);		
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

	.viz-key {
		visibility: visible;
		display: block;
	}
	.hide-key {
		visibility: hidden;
		display: none;
	}

</style>
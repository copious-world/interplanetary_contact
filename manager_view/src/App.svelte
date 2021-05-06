<script>
import { fetch_manifest } from "./ipfs_profile_proxy";

</script>
<!-- https://eugenkiss.github.io/7guis/tasks#crud -->
<script>
	//
	import Tab, { Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import { onMount } from 'svelte';
	import FloatWindow from './FloatWindow.svelte';
	import MessageDisplay from './MessageDisplay.svelte'
	import MessageEditor from './MessageEditor.svelte'
	import * as ipfs_profiles from './ipfs_profile_proxy.js'
	//
	let cid = ""


	let start_of_messages = 0
	let messages_per_pate = 100

	let prefix = '';
	let man_prefix = '';
	let i = 0;
	let c_i = 0;
	let i_i = 0;
	let form_index = 0

	let name = ''
	let DOB = ''
	let place_of_origin = ''
	let cool_public_info = ''
	let business = false

	let c_name = ''
	let c_DOB = ''
	let c_place_of_origin = ''
	let c_cool_public_info = ''
	let c_business = false

	let today = (new Date()).toUTCString()

	let active_user = false
	let known_users = [false]
  	let u_index = 0
	
	let manifest_selected_entry = false
	let manifest_selected_form = false
	let manifest_contact_form_list = [false]
	//
	let manifest_index = 0
	let man_title = ''
	let man_cid = ''
	let man_wrapped_key = ''
	let man_html = ''
	let man_max_preference
	//
	let active = 'Signup';
	let first_message = 0
	let messages_per_page = 100

	let green = false     // an indicator telling if this user ID is set

	let individuals = [
		{ "name": 'Hans Solo', "DOB" : "1000", "place_of_origin" : "alpha centauri", "cool_public_info" : "He is a Master Jedi", "business" : false, "public_key" : true, "cid" : "4504385938", "answer_message" : ""},
		{ "name": 'Max Martin', "DOB" : "1000", "place_of_origin" : "Fictional Name", "cool_public_info" : "He Made a lot of songs", "business" : true, "public_key" : false, "cid" : "4345687685", "answer_message" : "I got your songs"},
		{ "name": 'Roman Polanski', "DOB" : "1000", "place_of_origin" : "Warsaw,Poland", "cool_public_info" : "He Made Risque Movies", "business" : false, "public_key" : true, "cid" : "9i58w78ew", "answer_message" : "" }
	];

	let selected

	let inbound_solicitation_messages = [ { "name": 'Darth Vadar', "user_cid" : "869968609", "subject" : "Hans Solo is Mean", "date" : todays_date, "readers" : "luke,martha,chewy", "business" : false, "public_key" : false, "message" : "this is a message 4" } ]
	let inbound_contact_messages = [
		{ "name": 'Hans Solo', "user_cid" : "4504385938", "subject" : "Darth Vadier Attacks", "date" : todays_date, "readers" : "joe,jane,harry", "business" : false, "public_key" : true, "message" : "this is a message 1" },
		{ "name": 'Max Martin', "user_cid" : "4345687685", "subject" : "Adele and Katy Perry Attacks", "date" : todays_date, "readers" : "Lady Gaga, Taylor Swift, Bruno Mars", "business" : false, "public_key" : true, "message" : "this is a message 2"  },
		{ "name": 'Roman Polanski', "user_cid" : "9i58w78ew", "subject" : "Charlie Manson Attacks", "date" : todays_date, "readers" : "Attorney General, LA DA, Squeeky", "business" : true, "public_key" : true, "message" : "this is a message 3"  }
	]

	let message_selected = { "name": 'Admin', "subject" : "Hello From copious.world", "date" : today, "readers" : "you", "business" : false, "public_key" : false }

	let todays_date = (new Date()).toLocaleString()

	/*
      "wrapped_key" : false,
      "encoding" : "uri",
	  "when"  ... whereas"date" is a human readable string...
	*/

	let contact_form_links = [
		"contact_style_1.html",
		"contact_style_2.html"
	]

	let selected_form_link = "contact_style_1.html"


	function find_contact_from_message(message) {
		for ( let contact of individuals ) {
			if ( (contact.name == message.name) && (message.user_cid === contact.cid) ) {
				return contact
			}
		}
		return false
	}


	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

	$: filteredIndviduals = prefix
		? individuals.filter(individual => {
			const name = `${individual.name}`;
			return name.toLowerCase().startsWith(prefix.toLowerCase());
		})
		: individuals;

	$: selected = filteredIndviduals[i]

	$: reset_inputs(selected)

	// 
	$: selected_form_link = contact_form_links[form_index]

	//
	$: active_user = known_users[u_index]

	$: {
		name = active_user.name
		DOB = active_user.DOB
		place_of_origin = active_user.place_of_origin
		cool_public_info = active_user.cool_public_info
		business = active_user.business
	}

	$: filtered_manifest_contact_form_list = man_prefix
		? manifest_contact_form_list.filter(man_contact => {
			const name = `${man_contact.name}`;
			return name.toLowerCase().startsWith(man_prefix.toLowerCase());
		})
		: manifest_contact_form_list;

	$: {
		manifest_selected_entry = filtered_manifest_contact_form_list[manifest_index]
		if ( manifest_selected_entry !== undefined ) {
			manifest_selected_form = manifest_selected_entry.html
		}
		manifest_obj = {
			"default_contact_form" : man_cid,    // a template CID (composition done at the interface),
			"custom_contact_forms" : manifest_contact_form_list,
			"max_preference" : man_max_preference
		}
	}
	//

	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
 

	let window_scale = { "w" : 0.4, "h" : 0.8 }

	function popup_size() {
		let smallest_w = 200   // smallest and bigget willing to accomodate
		let biggest_w = 3000

		let smallest_h = 600
		let biggest_h = 1000

		// bounded window width
		let w = Math.max(smallest_w,window.innerWidth)
		w = Math.min(biggest_w,w)

		// bounded window height
		let h = Math.max(smallest_h,window.innerHeight)
		h = Math.min(biggest_h,h)

		let p_range
		let P
		//	percentage h range 
		let h_p_max = 0.96
		let h_p_min = 0.75
		p_range = h_p_max - h_p_min
		P = (biggest_h - h)/(biggest_h - smallest_h)
		console.log("P h: " + P)
		let h_scale = P*(p_range) + h_p_min

		//	percentage w range 
		let w_p_max = 0.96
		let w_p_min = 0.20
		p_range = w_p_max - w_p_min
		P = (biggest_w - w)/(biggest_w - smallest_w)
		console.log("P w: " + P)
		let w_scale = P*(p_range) + w_p_min

		// Setting the current height & width 
		// to the elements 

		return { "w" : w_scale, "h" : h_scale }
	}

	//
	window_scale = popup_size()
	//
	onMount(() => {
		window.addEventListener("resize", (e) => {
			//
			let scale = popup_size()
			//
			window_scale.h = scale.h; 
			window_scale.w = scale.w;
			//
		})

		fetch_messages()
		fetch_contacts()
		fetch_manifest()
	})



// PROFILE  PROFILE  PROFILE  PROFILE  PROFILE  PROFILE  PROFILE 
// PROFILE  PROFILE  PROFILE  PROFILE  PROFILE  PROFILE  PROFILE 

	// ADD PROFILE.....
	async function add_profile() {
		//
		let user_data = {
			"name": name,
			"DOB" : DOB,
			"place_of_origin" : place_of_origin, 
			"cool_public_info" : cool_public_info, 
			"business" : business, 
			"public_key" : false, 
			"form_link" : selected_form_link,  // a cid to a template ??
			"answer_message" : ""
		}
		await gen_public_key(user_data) // by ref
		green = await ipfs_profiles.add_profile(user_data)
		//
		await get_active_users()
		u_index = (known_users.length - 1)
		//
	}

	async function get_active_users() {
		try {
			known_users = await window.get_known_users()
		} catch (e) {}
	}

	// initialize
	get_active_users()

// MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES
// MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES


	function pop_editor() {
		start_floating_window(1);
	}

	function show_subject() {

	}

	function full_message(ev) {
		if ( ev ) {
			let dom_el = ev.target;
			while ( dom_el && (dom_el.id.length === 0) ) {
				dom_el = dom_el.parentNode;
				if ( dom_el && (dom_el.id.length !== 0) ) {
					let parts = dom_el.id.split('_')
					if ( parts[0] === 'm' ) {
						if ( parts[1] === 'contact' ) {
							let index = parseInt(parts[2])
							message_selected = inbound_contact_messages[index]
						} else {
							let index = parseInt(parts[2])
							message_selected = inbound_solicitation_messages[index]
						}
						break;
					}
				}
			}
		}
		let contact = find_contact_from_message(message_selected)
		if ( contact ) {
			contact.answer_message = `&lt;subject ${message_selected.subject}&gt;<br>` + message_selected.message
		}
		start_floating_window(0);
	}


	async function fetch_messages() {
		let identify = active_user
		if ( identify ) {
			let user_info = identify.user_info
			let all_inbound_messages = await ipfs_profiles.get_message_files(identify,start_of_messages,messages_per_pate)
			inbound_contact_messages = all_inbound_messages[0]
			inbound_solicitation_messages = all_inbound_messages[1]
		}
	}


// CONTACTS CONTACTS CONTACTS CONTACTS CONTACTS CONTACTS CONTACTS CONTACTS
// CONTACTS CONTACTS CONTACTS CONTACTS CONTACTS CONTACTS CONTACTS CONTACTS


	function reset_inputs(individual) {
		c_name = individual ? individual.name : '';
		c_DOB = individual ? individual.DOB : '';
		c_place_of_origin = individual ? individual.place_of_origin : '';
		c_cool_public_info = individual ? individual.cool_public_info : '';
		c_business = individual ? individual.business : '';
	}


	async function add_contact() {
		let contact = {
			"name": c_name,
			"DOB" : c_DOB,
			"place_of_origin" : c_place_of_origin, 
			"cool_public_info" : c_cool_public_info, 
			"business" : c_business, 
			"public_key" : c_public_key, 
		}
		individuals = individuals.concat(contact);
		i = individuals.length - 1;
		first = '';
		//
		let identify = active_user
		if ( identify ) {
			let update_cid = await ipfs_profiles.update_contacts_to_ipfs(cid,business,individuals)
			identify.files.contacts = update_cid
			update_identity(identify)
		}
		//
	}

	async function update_contact() {
		selected.name = c_name;
		selected.DOB = c_DOB;
		selected.place_of_origin = c_place_of_origin;
		selected.cool_public_info = c_cool_public_info;
		selected.business = c_business;
		selected.public_key = c_public_key;
		//
		let identify = active_user
		if ( identify ) {
			let update_cid = await ipfs_profiles.update_contacts_to_ipfs(cid,business,individuals)
			identify.files.contacts = update_cid
			update_identity(identify)
		}
		//
	}

	async function remove_contact() {
		// Remove selected person from the source array (people), not the filtered array
		const index = individuals.indexOf(selected);
		individuals = [...individuals.slice(0, index), ...individuals.slice(index + 1)];

		first = last = '';
		i = Math.min(i, filteredIndviduals.length - 2);
		//
		let identify = active_user
		if ( identify ) {
			let update_cid = await ipfs_profiles.update_contacts_to_ipfs(cid,business,individuals)
			identify.files.contacts = update_cid
			update_identity(identify)
		}
		//
	}

	async function fetch_contacts() {
		let identify = active_user
		if ( identify ) {
			let contacts_cid = identify.files.contacts
			let user_cid = identify.cid
			individuals = await ipfs_profiles.fetch_contacts(contacts_cid,user_cid)
		}
	}

	// ---- ---- ---- ---- ---- ---- ----
	function preview_contact_form(ev) {
		// start_floating_window(2);
	}


// MANIFEST MANIFEST MANIFEST MANIFEST MANIFEST MANIFEST MANIFEST MANIFEST MANIFEST 

	async function man_add_contact_form() {
		//
		let a_contact_form = {
			"title" :  man_title,
			"cid" : man_cid,
			"wrapped_key" : man_wrapped_key,
			"html" : man_html
		}
		//
		manifest_contact_form_list = manifest_contact_form_list.concat(a_contact_form);
		manifest_index = manifest_contact_form_list.length - 1;
		//
		manifest_obj.custom_contact_forms = manifest_contact_form_list
		//
		let identify = active_user
		if ( identify ) {
			let update_cid = await ipfs_profiles.update_manifest_to_ipfs(cid,business,manifest_obj)
			identify.files.contacts = update_cid
			update_identity(identify)
		}
		//
	}

	async function man_update_contact_form() {
		//
		manifest_selected_entry.title = man_title;
		manifest_selected_entry.cid = man_cid;
		manifest_selected_entry.wrapped_key = man_wrapped_key;
		manifest_selected_entry.html = man_html;
		//
		let identify = active_user
		if ( identify ) {
			let update_cid = await ipfs_profiles.update_manifest_to_ipfs(cid,business,manifest_obj)
			identify.files.contacts = update_cid
			update_identity(identify)
		}
		//
	}

	async function man_remove_contact_form() {
		// Remove selected person from the source array (people), not the filtered array
		const index = manifest_contact_form_list.indexOf(manifest_selected_entry);
		manifest_contact_form_list = [...manifest_contact_form_list.slice(0, index), ...manifest_contact_form_list.slice(index + 1)];
		manifest_index = Math.min(manifest_index, filtered_manifest_contact_form_list.length - 2);
		//
		manifest_obj.custom_contact_forms = manifest_contact_form_list
		//
		let identify = active_user
		if ( identify ) {
			let update_cid = await ipfs_profiles.update_manifest_to_ipfs(cid,business,manifest_obj)
			identify.files.contacts = update_cid
			update_identity(identify)
		}
		//
	}


	async function fetch_manifest() {
		let identify = active_user
		if ( identify ) {
			let manifest_cid = identify.files.manifest
			let user_cid = identify.cid
			manifest_obj = await ipfs_profiles.fetch_contacts(manifest_cid,user_cid)
		}
	}


</script>

<style>
	* {
		font-family: inherit;
		font-size: inherit;
	}

	input {
		display: block;
		margin: 0 0 0.5em 0;
	}

	select {
		float: left;
		margin: 0 1em 1em 0;
		width: 14em;
	}

	.buttons {
		clear: both;
	}

	.inner_div {
		padding-top: 4px;
		border-bottom: 1px lightgray solid;
		min-height: 40px;
	}

	.long_button {
		width:40%;
	}

	.nice_message {
		width: 50%;
		font-size: smaller;
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
		color:rgb(120, 183, 221);
		font-weight:600;
	}

	.top_instructions {
		padding: 2px;
		color:rgb(36, 16, 3);
		border-bottom: sienna 1px solid;
		font: 0.9em sans-serif;
		font-weight: 600;
	}


	.team_message {
		background-color: rgb(254, 252, 245);
		border: solid 1px darkblue;
		padding:4px;
		color:rgb(12, 12, 100);
	}

	.items {
		display: flex;
		flex-wrap: wrap;
		margin-left: 2px;
		margin-top: -10px;
	}

	.items .item {
		flex: 1 0 300px;
		box-sizing: border-box;
		background: -webkit-linear-gradient(to right, rgba(242, 242, 210, 0.3), white);
		background: linear-gradient(to right, rgba(242, 242, 210, 0.3), white );
		color: #171e42;
		padding: 10px;
		margin-left: 2px;
		margin-top: 0px;
	}

	.items {
		padding-left: 5px;
		padding-bottom: 4px;
		padding-right: 12px;
		font-size: 110%;
		font-family: sans-serif;
	}
	
	td, th {
		border : 1px solid rgb(47, 79, 49);
		border-right: none;
		padding : 2px;
		margin : 0px;
	}

	th {
		color :rgb(47, 79, 49);
		font-weight: bolder;
		background-color: seashell;
	}

	table {
		border-right: solid 1px darkslategray;
	}

	.subject {
		font-weight: bold;
	}

	.sender {
		background-color: rgb(255, 255, 255);
		font-weight: 600;
		color:rgb(27, 78, 31);
		padding-left: 4px;
	}


	.tableFixHead {
		overflow-y: auto;
		height: calc(100vh - 200px);
	}
	.tableFixHead thead th {
		position: sticky;
		top: 0;
	}
	table {
		border-collapse: collapse;
		width: 100%;
	}
	th, td {
		padding: 8px 16px;
		border: 1px solid #ccc;
	}
	th {
		background: #eee;
	}

	tr {
		cursor: pointer;
	}

	.signup-grid-container {
		display: grid;
		grid-column-gap: 2px;
		grid-row-gap: 2px;
		grid-template-columns: auto auto;
		background-color: rgb(250, 250, 242);
		padding: 4px;
	}

	.signerupper {
		background-color: rgb(251, 254, 245);
		border: solid 1px darkblue;
		padding:4px;
	}

	.manifest-grid-container {
		display: grid;
		grid-column-gap: 2px;
		grid-row-gap: 2px;
		grid-template-columns: auto auto;
		background-color: rgb(250, 250, 242);
		padding: 4px;
	}
	.manifester {
		background-color: rgb(251, 254, 245);
		border: solid 1px darkblue;
		padding:4px;
	}
</style>

<div>
	<!--
	  Note: tabs must be unique. (They cannot === each other.)
	-->
	<TabBar tabs={['Identify', 'User', 'Messages', 'Introductions', 'Contacts', 'Manifest', 'About Us']} let:tab bind:active>
	  <!-- Note: the `tab` property is required! -->
	  <Tab {tab}>
		<Label>{tab}</Label>
	  </Tab>
	</TabBar>
  <br>

	{#if (active === 'Identify')}
	<div>
		{#if active_user }
		<div>
			The current user is {active_user}.
			<br>
			Not you?
			<br>
			<select bind:value={u_index} size={10}>
				{#each known_users as maybe_user, u_index }
					<option value={u_index}>{maybe_user.name}</option>
				{/each}
			</select>
		</div>
		{:else}
		<div>
			Please join in using this way of sending messages. 
			Click on the <span style="font-weight: bold;">User</span> tab.
		</div>
		{/if}
	</div>
  	{:else if (active === 'User')}
	<div class="signup-grid-container">
		<div class="signerupper">
			<br>
			<div class="top_instructions" >
				Please enter Unique Information about yourself which you would be willing to share with anyone:
			</div>
			<br>
			<div class="inner_div" >
				<label for="name"style="display:inline" >Name: </label>
				<input id="name" bind:value={name} placeholder="Name" style="display:inline">
				<input bind:checked={business}  type="checkbox" style="display:inline" ><span>Business (if checked)</span>
			</div>
			<div class="inner_div" >
				{#if business }
					<label for="DOB" style="display:inline" >Year of Inception: </label><input id="DOB" bind:value={DOB} placeholder="Year of Inception" style="display:inline" >
				{:else}
					<label for="DOB" style="display:inline" >DOB: </label><input id="DOB" bind:value={DOB} placeholder="Date of Birth" style="display:inline" >
				{/if}
			</div>
			<div class="inner_div" >
				{#if business }
					<label  for="POO" style="display:inline" >Main Office: </label><input id="POO" bind:value={place_of_origin} placeholder="Main Office" style="display:inline" >
				{:else}
					<label for="POO" style="display:inline" >Place of Origin: </label><input id="POO" bind:value={place_of_origin} placeholder="Place of Origin" style="display:inline" >
				{/if}
			</div>
			<div class="inner_div" >
			<label for="self-text">Cool Public Info</label><br>
			<textarea id="self-text" bind:value={cool_public_info} placeholder="Something you would say to anyone about yourself" />
			</div>
	
			<div class="nice_message">
				Enter your information above. It will be used to make an identifier to be used in your contact page.
				The information should be unique. For example, I know that my name is shared by at least three other people on the planet,
				all of whom were born in the same year. But, they are from differts or countries.
				The information that you enter may be used later in an API link only if you have interests for which you would be willing to receive unsolicited mail 
				from groups you choose to select. You may make selections at a later time. 
				<span style="color:blue;">Note:</span> no information will be sent to any organization as a result of signing up.
				All information and your personalized assets, including your contact page will be stored in the Interplanetary File System, and will be 
				accessible from there through any service you wish to use to access it.
			</div>
			<button class="long_button" on:click={add_profile}>Create my contact page.</button>
		</div>
		<div class="signerupper">
			<div>
				drop a picture here
			</div>
			<div>
				<div>Select a contact from</div>
				<div>
					<div class="tableFixHead" >
						<select bind:value={form_index} size={10}>
							{#each contact_form_links as form_link, form_index}
								<option value={form_index}>{form_link}</option>
							{/each}
						</select>
					</div>
				</div>
			</div>
		</div>
	</div>
	{:else if (active === 'Messages')}
		<div>Your Message History</div>
		<div>
			<div class="tableFixHead" >
				<table style="width:100%">
					<thead>
						<tr>
							<th style="width:20%">Date</th><th style="width:30%">Sender</th><th style="width:60%;text-align: left;">Subject</th>
						</tr>
					</thead>
				{#each inbound_contact_messages as a_message, c_i }
					<tr on:click={full_message} id="m_contact_{c_i}" class="element-poster"  on:mouseover="{show_subject}">
						<td class="date"  style="width:20%;text-align:center">{a_message.date}</td>
						<td class="sender"  style="width:30%">{a_message.name}</td>
						<td class="subject" style="width:60%">{a_message.subject}</td>
					</tr>
				{/each}
				</table>
			</div>
		</div>
	{:else if active === 'Introductions' }
		<div>Introduction Messages</div>
		<div>
			<div class="tableFixHead" >
				<table style="width:100%">
					<thead>
						<tr>
							<th style="width:20%">Date</th><th style="width:30%">Sender</th><th style="width:60%;text-align: left;">Subject</th>
						</tr>
					</thead>
				{#each inbound_solicitation_messages as a_message, i_i }
					<tr on:click={full_message} id="m_intro_{i_i}" class="element-poster"  on:mouseover="{show_subject}">
						<td class="date"  style="width:20%;text-align:center">{a_message.date}</td>
						<td class="sender"  style="width:30%">{a_message.name}</td>
						<td class="subject" style="width:60%">{a_message.subject}</td>
					</tr>
				{/each}
				</table>
			</div>
		</div>
	{:else if (active === 'Contacts')}
	<div class="items">
		<div class="item" >
			<input placeholder="filter prefix" bind:value={prefix}>
			<select bind:value={i} size={5}>
				{#each filteredIndviduals as individual, i}
					<option value={i}>{individual.name}</option>
				{/each}
			</select>
			<div class='buttons'>
				<button on:click={add_contact} disabled="{!c_name}">add</button>
				<button on:click={update_contact} disabled="{!c_name || !selected}">update</button>
				<button on:click={remove_contact} disabled="{!selected}">delete</button>
			</div>
		</div>
		<div class="item" style="border-top:darkslategrey solid 2px;">
			<br>
			<div class="inner_div" >
				<label for="name"style="display:inline" >Name: </label>
				<input id="name" bind:value={c_name} placeholder="Name" style="display:inline">
				<input bind:checked={c_business}  type="checkbox" style="display:inline">
				{#if c_business }
					<span>Business</span>
				{:else}
					<span>Person</span>
				{/if}
			</div>
			<div class="inner_div" >
				{#if c_business }
					<label for="DOB" style="display:inline" >Year of Inception: </label><input id="DOB" bind:value={c_DOB} placeholder="Year of Inception" style="display:inline" >
				{:else}
					<label for="DOB" style="display:inline" >DOB: </label><input id="DOB" bind:value={c_DOB} placeholder="Date of Birth" style="display:inline" >
				{/if}
			</div>
			<div class="inner_div" >
				{#if c_business }
					<label  for="POO" style="display:inline" >Main Office: </label><input id="POO" bind:value={c_place_of_origin} placeholder="Main Office" style="display:inline" >
				{:else}
					<label for="POO" style="display:inline" >Place of Origin: </label><input id="POO" bind:value={c_place_of_origin} placeholder="Place of Origin" style="display:inline" >
				{/if}
			</div>
			<div class="inner_div" >
			<label for="self-text">Cool Public Info</label><br>
			<textarea id="self-text" bind:value={c_cool_public_info} placeholder="Copy info given to you by your new contact" />
			</div>
		</div>
		<div class="item"  style="border-top:darkslategrey solid 2px;" >
			<span class="top_instructions" >Compose a new message for:</span> {c_name}
			<br><br>
			<button class="long_button" on:click={pop_editor}>compose</button>
		</div>
	</div>
	{:else if (active === 'Manifest') }
	<div>
		<blockquote>
			The manifest is your list of custom contact forms. 
			When you send a message to someone, you may send them a link to one of your contact forms that will best handle 
			the way that your contact might respond to you. Use the tools here to manage your collection of contact forms.
		</blockquote>
		<div class="manifest-grid-container" >
			<div class="manifester">
				<div class="items">
					<div class="item" >
						<input placeholder="filter prefix" bind:value={man_prefix}>
						<select bind:value={manifest_index} size={5}>
							{#each filtered_manifest_contact_form_list as contact_item, manifest_index}
								<option value={manifest_index}>{contact_item.name}</option>
							{/each}
						</select>
						<div class='buttons'>
							<button on:click={man_add_contact_form} disabled="{!man_title}">add</button>
							<button on:click={man_update_contact_form} disabled="{!man_title || !manifest_selected_entry}">update</button>
							<button on:click={man_remove_contact_form} disabled="{!manifest_selected_entry}">delete</button>
						</div>
						<div class="inner_div" >
							<label for="name"style="display:inline" >Name: </label>
							<input id="name" bind:value={man_title} placeholder="Name" style="display:inline">
							//
							<label for="name"style="display:inline" >Preference Level: </label>
							<input id="name" bind:value={man_max_preference} placeholder="Name" style="display:inline">
							
							<label for="name"style="display:inline" >Manifest IPFS Link: </label>
							<input id="name" bind:value={man_cid} placeholder="Name" style="display:inline">
						</div>
					</div>
				</div>
			</div>
			<div class="manifester">
				{@html manifest_selected_form}
			</div>
		</div>
		</div>
	</div>
	{:else if (active === 'About Us') }
	<div  class="team_message" >
	This service is free. It is a way for you to set up messaging with other people.
	It is like email, but it offers an alernative ways of running your message process.
	<br>
	For one, there is no email service associated with this way of handling messages. 
	All messages and interfaces for interacting with the processes are stored on the Inner Planetary File System.
	<br>
	Your contact pages is stored there. This tool makes the contact page and stores it for you. Then when someone wants to send 
	you a message, they access your contact page. The person who sends you a message will write a message on your page and click send.
	The contact page you use will send a message service that is baked into the contact page. 
	<br>
	This tool, makes and stores the kind of contact page you want to store. So, by selecting the type of contact page, you will also be selecting 
	how you want to communicate. You also get to select your style of contact page. Maybe you want to have your picture on it, maybe not.
	Depending on the community of contact page makers, you may find different styles. Each style is part of a template. And, you select the template.
	<br>
	<span style="font-weight: bold;">How to get the word out about your page?</span> You are probably used to handing out a business card with your email on it.
	But, instead of that, you can hand out the link to your contact page. The actual link that you receive when you sign up might be hard to read. 
	But, you can give out the contents of the fields that you entered in order to make your contact page. 
	<br>
	The reason we have asked for information you might tell anyone is that we are asking for information you want to share. This information should identify you,
	but not give away secrets. When someone sends a message, we can find your contact page by reprocessing the same information.
	<br>
	If you don't want to print you contact information on your business card, you can always just give out the hash code.
	But, keep in mind, your contacts will have to type it.
	<br>
	Now, you can store contact information in your list of contacts. Each of these links will find the contact page.
	<br>
	Now about getting unsoliceted mail or blog feeds from organizations. For these you get a separate number. Messages being sent through a messaging service will use
	an API link to send messages to the agreed upon topic (the topic you tell the organization that they can bug you about.) You can use your topic dashbaord to 
	select the latest news from organization you care about. 
	<br>
	Messages from contacts will show up in your mail stream (promail). Find links to that on your management dashboard (also generated by when you sign up.)
	To help you find your information when you go back to your browser, the information you enter on signing up will be stored in your broswer's database (indexedDb).
	If you switch browsers, you can always enter your information again, and click "restore". You will also find an option to remove your information from your browser.
	</div>
	{/if}
  </div>

<FloatWindow title={message_selected.name} scale_size={window_scale} index={0} use_smoke={false}>
	<MessageDisplay {...message_selected}  />
</FloatWindow>

<FloatWindow title={selected.name} scale_size={window_scale} index={1} use_smoke={false}>
	<MessageEditor {...selected} active_user={active_user} />
</FloatWindow>
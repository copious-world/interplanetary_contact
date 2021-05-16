<script>

	// ref ... https://gist.github.com/akirattii/9165836

	// `current` is updated whenever the prop value changes...
	export let color;
	export let entry;
	export let title;
	export let dates;
	export let subject;
	export let abstract;
	export let txt_full;

	export let cid;

	export let updating;

	import * as ipfs_profiles from './ipfs_profile_proxy.js'
	import * as utils from './utilities.js'

	//import { createEventDispatcher } from 'svelte';

	let required_fields_needed = true
	//const dispatch = createEventDispatcher();

	let updated_when
	let created_when

	$: updated_when = convert_date(Date.now())
	$: created_when = convert_date(Date.now())


	let key_entry = ""
	let key_str = ""
	$: key_str = key_entry

	$: required_fields_needed = ((txt_full.length < 3)
									|| (subject.length === 0)
									|| (txt_full.length < 20)
									|| (key_str.length < 4))

	//
	let store_template = {}

	$: store_template = {
		"dates" : {
			"created" : created_when,
			"updated" : updated_when
		},
		"keys" : key_str.split(',').map(ky => { return ky.trim() }),
		"score" : 1.0,
		"subject" : subject,
		"title" : title,
		"txt_full" : txt_full,
		"var_map" :  utils.unload_html_vars(txt_full) 
	}

	function do_save_template(event) {
		store_to_ipfs(store_template)
		/*
		dispatch('message', {
			type: 'save-template',
			template: store_template
		});
		*/
	}

	async function store_to_ipfs(template_descr) {
		// This is a test
		let tname = template_descr.title
		if ( tname.indexOf(' ') ) {
			tname = encodeURIComponent(tname)
		}
		let t_cid = await ipfs_profiles.put_contact_template(tname,template_descr)
		cid = t_cid
	}



	function convert_date(secsdate) {
		if ( secsdate === 'never' ) {
			return 'never';
		} else {
			let idate = parseInt(secsdate)
			let dformatted = (new Date(idate)).toLocaleDateString('en-US')
			return (dformatted)
		}
	}



</script>
 
<div class="blg-el-wrapper-full">
	<div style="padding:6px;width:100%" >
		<div class="buttons form-holder">
			<span style="background-color: yellowgreen">{created_when}</span>
			<span style="background-color: lightblue">{updated_when}</span>
			<button on:click={do_save_template} disabled={required_fields_needed}>save</button>

			{#if updating }
			<span style="background-color: yellowgreen">changing existing template</span>
			{:else}
			<span style="background-color: lightblue">adding new template</span>
			{/if}
		</div>
		<div class="form-holder" >
			<span style="background-color:midnightblue">cid:</span> {cid}
		</div>
		<div class="form-holder">
			<span style="background-color:darkslateblue">Title</span>&nbsp;&nbsp;
			<span class="blg-item-title" style="background-color: inherit;"
						contenteditable="true"
						bind:innerHTML={title}
			></span>
		</div>
		<div class="form-holder">
			<span style="background-color:dodgerblue">Keywords</span>&nbsp;&nbsp;
			<span class="keystr-display"
						contenteditable="true"
						bind:innerHTML={key_entry}>
			</span>		
		</div>
		<div class="form-holder">
			<span style="background-color:navy">subject</span>&nbsp;&nbsp;
			<span class="blg-item-subject"
				contenteditable="true"
				bind:innerHTML={subject}>
			</span>		
		</div>
	</div>
	<div class="content-title" style="background-color: cornsilk;border:solid 1px navy;padding:2px;width:100%">Content display:</div>
	<div id="blg-window-full-text"  class="full-display" >
		{@html txt_full}
	</div>
	<span class="content-title">Edit content here:</span><span class="content-suggestion">(This editor works best as a place to drop previously edited content)</span>
	<textarea bind:value={txt_full}></textarea>
</div>

<style>

	.form-holder {
		margin-bottom: 0.8em;
		margin-top: 0.4em;
		width:100%;
		color : black;
		background-color: inherit;
		border-bottom: 1px lightblue solid;
	}

	.content-title {
		font-weight: bold;
		color:rgb(75, 18, 18)
	}
	.content-suggestion {
		font-weight: bold;
		color:rgb(30, 109, 53);
		font-size:smaller;
		font-style: oblique;
	}

	.blg-el-wrapper-full {
		overflow-y: hidden;
		height:inherit;
		width: 100%;
	}
	span {
		padding: 0.2em 0.5em;
		margin: 0 0.2em 0.2em 0;
		text-align: center;
		border-radius: 0.2em;
		color: white;
	}

	.blg-item-title {
		color:black;
		border-bottom: 1px darkslateblue solid;
		padding: 0.2em 0.5em;
		margin: 0 0.2em 0.2em 0;
		color:black;
		text-align: left;
		width: 60%;
	}

	.blg-item-subject {
		border: 1px black solid;
		border-radius: 0.2em;
		padding: 0.2em 0.5em;
		margin: 0 0.2em 0.2em 0;
		color:black;
		width: 60%;
	}


	textarea { width: 100%; height: 80px; }

	.full-display {
		background-color: rgba(255, 255, 255, 0.9);
		color: rgb(73, 1, 1);
		border-top: solid 2px rgb(88, 4, 88);
		padding: 6px 4px 6px 4px;
		overflow-y: scroll;
		height: calc(30vh - 80px);
		border-bottom: solid 1px rgb(88, 4, 88);
	}

	.cid-embedded-form {
		height:inherit
	}

	.keystr-display {
		background-color: rgb(245, 245, 245);
		border: 1px black solid;
		border-radius: 0.2em;
		padding: 0.2em 0.5em;
		margin: 0 0.2em 0.2em 0;
		color:black;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		width: 50%;
	}

	.buttons {
		clear: both;
	}

	.buttons span {
		font-weight: bold;
		text-transform: capitalize;
		font-size:85%;
	}

	.buttons button:disabled {
		color:slategrey;
		border-bottom-color: rgb(233, 237, 240);
	}

	.buttons button {
		background-color:rgb(248, 252, 231);
		font-size:small;
		border-bottom-color: rgb(69, 102, 45);
		border-radius: 6px;
		font-weight: 580;
		font-style: oblique;
		height:fit-content;
	}

	.buttons button:hover {
		background-color:rgb(245, 239, 219);
		font-size:small;
		border-bottom-color: rgb(110, 148, 135);
		border-radius: 6px;
		font-weight: 580;
		font-style: oblique;
		height:fit-content;
	}

	.buttons button:disabled:hover {
		background-color:inherit;
		font-size:small;
		border-bottom-color: rgb(228, 240, 247);
		border-radius: 6px;
		font-weight: 580;
		font-style: oblique;
	}

</style>
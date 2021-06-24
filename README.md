# Interplanetary Contact

 A web base identity manager including
 
 * **identity creation and management**
 * **contact management** 
 * **inter-contact mail**
 * **separate contact message pathways:** 
	* *introduction* (clear text) 
	* *contact-to-contact* (enciphered text)

>Built on top of **IPFS** and **cypto.subtle**
 
### Purpose

Use an IPFS node for identity and messaging instead of an e-mail server which transfers email through hops owned by centeralized service providers.

#### Demo Link

A demo working with minimal confidence (06/20/2021)

[interplanetary contact](https://www.copious.world/interplanetary-contact/)

### Overview

>Instead of providing an email to a new contact, provide a short textual description of yourself instead. The description can be translated into an IPFS cid for finding your contact's message pathways. This cid made by this application, is the *clear cid*; it identifies a pathway for messages in the clear, *introductions*.
>
>There is more than one cid per user (two, actually). The second one is derived from your textual self-description and from public keys and signatures as well. The *clear cid* is included in the construction of the second cid, the *crypto cid*. The *crypto cid* identifies contact-to-contact **c2c** message pathways.
>

#### Included Code
There are two parts to the code here: 1) a web service (see index.js and lib); 2) a web interface written in Svelte (see manager view). 

There are two other web interfaces. One is for managing contact email forms. The other is for topics, a special interface for messages from clubs and businesses. **(NOTE: these two interfaces are less developed than  the manager view.)** The *template-admin* interface is functional, but it may be confusing at the moment. The *topic_page* is not yet ready to try.

#### Template Admin 
A word on this:
> The message composition interface is providing a means to curate *contact forms*. Really, these are versions of e-mail composition interfaces. It seemed to be a nice feature to allow users to request that message replies could be edited in custom composition interfaces. So, messages may contain a cid to a contact form which may be customized in any way. 
> 
> So, imagine a wedding shower or a birthday. The interface can open up to a reply to invitation display. (More artistic work is needed to make this nice.)

# Current Project State

Currently, the author has tested creating new contacts and sending messages between them. It seems to work. 

Identity creation starts in the browser. A certain amount of the identity creation and management is passed off to a server (fastify based) that interfaces to IFPS, by wrapping a node.  (This is js-ipfs.)  

Currently, the server is running on a ZeroPi, 512MB Ram with a 64GB USB drive containing the repository. It's slow. The aim of using the small and very inexpensive server is experimental and may eventually work with embedded IPFS

The server code is writen in JavaScript as a node.js app. One part of the roadmap should be to port the server code to run in the browser along with the UI application.

The Web UI application can host more than one identity. This is good for testing and may continue to work that way since other writers could allow more than one idenity per browser (and URL). It is assumed that if more than one person uses a browser that they are all associated or are perhaps the same person in separate roles.

All identities are stored in IndexedDB. IndexedDB is sensitive to the URL. Idenities do not have to stay in the browser. The interface provides buttons to intiate processes that all the user to download his identity to a prefered storage device, to upload an identity previsously created by the interface, to delete the identity from the browser, and create a new identity. Anyone using the interface will at least create an identity.

### Locality

The current code does not fully use the IPFS infrastructure. The **NEXT STEP** of this project will be to make sure it makes full use of IPFS or even extends IPFS. 

The server code (to be found in the lib/ directory) uses the mutable file system, which works on things local to the node. So, the server is basically a centeralized e-mail server.

A means of making the messaging peer-to-peer will soon be proposed. This messaging addressed by this project is different than pub-sub messaging, which may have a real-time aim. This messaging is the slow kind in which messages along with attachments are stored in a spool file/directory belonging to the receiver of a message.

### Interface Art
The author of this interface makes functional web interfaces with a certain amount of peculiar styling. There is a need for those more motivated to make actractive user interface to participate in this creation.

Some improvements needed are the following:

* resizable window
* draggable guides within windows
* edit operation flow
* clear reactive transition between desktop and mobile
* better favicon
* nicer text editing
* icons for attachments
* etc. 

####Interface Changes
Operations on messages list items are now limited to delete, and move to other buckets. The operation window allows the user to view delete messages or messags in buckets. The messages may be moved between buckets. But, there is no way to manage the list of buckets at the moment.

**Paging:** Paging is not yet well addressed for the message lists on this interface.

### The other interfaces
As mentioned previoulsy, there is a template editing interface. This is also a svelte projects. The code is based on copious-world/svelte-blog. There is a special window for taking in HTML contact forms. There is a particular vocablury of template variables that will have to be further developed.

The topic interface, on the roadmap. This is supposed to provide a grid display of topics that the user chooses to receive (junk-mail) messages from (say music groups and IoT toys). The topic grid should use icons from offering entities and should use animation to indicate the presence of new offers. The process of introduction should be used for topics just as it does for contact introduction. 

# Parts, Components

**manager_view/public/index.js**  
Code for creating keys and keeping records of private keys and other user information may be found in index.html under the directory /manager_view/public. (Some artifacts slipped in -- so some cleanup is ahead.) There are other projects within copious-world that keep a basic library within index.html. Perhaps in the future, people who care about where code is might change the layout of these functions, but this works for now. And, copious-world provides some basic pre-rollup tools for dumpling libraries into these index.html wrapper pages.

Within the Svelte style index.html pages, there will a reference to the build directory for quasi-compiled JS code and there is a call to the App constructor.

**manager_view/src**  
This directory includes Svelte components for the main display (App.svelte) and code for moveable subwindows. There are two js files which use the module format. One file, ipfs\_profile\_proxy.js, provides the interface to the server.

The flaoting window, FloatWindow.svelte, could be better Svelte and could be its own module. It has a slot for application component such as the editor and the message display.

There is a window accessible by the "ops" button on the main application window message lists. The ops allow for messages to be deleted or moved to what is now a fixed list of categories.

**index.js**

In order to start the server, run the following command:

>node index.js

The module offers four GET methods and eighteen POST methods. 

Tempate methods include:

* /put/template
* /get/template-cid-from-name/:biz/:name
* /get/template-cid-from-name/:biz/:name
* /get/template-cid/:cid
* /template-list/:narrow_search

Generic data methods include:

* /get/blob
* /put/blob
* /get/json-cid/:cid

Methods related to a user profile include:

* /add/profile
* /get/user-cid
* /get/user-info
* /dir
* /get-asset/:asset
* /get-contact-page/:asset
* /put-asset/:asset

Methods related to messaging are the following:

* /send/message
* /send/introduction
* /send/topic
* /send/topic_offer
* /get-spool
* /message-list-op/:op

**/lib/ipfs\_user\_profile.js**  
This module provide "business logic" interface between the web service entrt points and ipfs_manage_files.js. The determination of directory structure for users can be found here.

**/lib/ipfs\_manage\_files.js**  
All calls to IPFS modules (js-ipfs-core) can be found here.






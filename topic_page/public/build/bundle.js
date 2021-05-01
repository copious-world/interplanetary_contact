
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.37.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Thing.svelte generated by Svelte v3.37.0 */

    const file$6 = "src/Thing.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (67:0) {:else}
    function create_else_block(ctx) {
    	let div;
    	let h4;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "End of Content";
    			attr_dev(h4, "class", "blg-item-title svelte-f8idzx");
    			set_style(h4, "background-color", "lightgrey");
    			set_style(h4, "color", "darkgrey");
    			add_location(h4, file$6, 68, 1, 1573);
    			attr_dev(div, "class", "blg-el-wrapper svelte-f8idzx");
    			add_location(div, file$6, 67, 0, 1543);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(67:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (49:0) {#if dates.created != 'never' }
    function create_if_block$3(ctx) {
    	let div2;
    	let span0;
    	let t0;
    	let t1;
    	let span1;
    	let t2;
    	let t3;
    	let h4;
    	let t4;
    	let t5;
    	let div0;
    	let span2;
    	let t7;
    	let h5;
    	let t8;
    	let t9;
    	let div1;
    	let each_value = /*graphics*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			span0 = element("span");
    			t0 = text(/*created_when*/ ctx[3]);
    			t1 = space();
    			span1 = element("span");
    			t2 = text(/*updated_when*/ ctx[2]);
    			t3 = space();
    			h4 = element("h4");
    			t4 = text(/*short_title*/ ctx[4]);
    			t5 = space();
    			div0 = element("div");
    			span2 = element("span");
    			span2.textContent = "subject";
    			t7 = text("  ");
    			h5 = element("h5");
    			t8 = text(/*short_subject*/ ctx[5]);
    			t9 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(span0, "background-color", "yellowgreen");
    			attr_dev(span0, "class", "svelte-f8idzx");
    			add_location(span0, file$6, 51, 1, 1024);
    			set_style(span1, "background-color", "lightblue");
    			attr_dev(span1, "class", "svelte-f8idzx");
    			add_location(span1, file$6, 52, 1, 1091);
    			attr_dev(h4, "class", "blg-item-title svelte-f8idzx");
    			set_style(h4, "background-color", "inherit");
    			add_location(h4, file$6, 53, 1, 1156);
    			set_style(span2, "background-color", "navy");
    			attr_dev(span2, "class", "svelte-f8idzx");
    			add_location(span2, file$6, 55, 1, 1245);
    			attr_dev(h5, "class", "blg-item-subject svelte-f8idzx");
    			add_location(h5, file$6, 55, 63, 1307);
    			add_location(div0, file$6, 54, 1, 1238);
    			attr_dev(div1, "class", "teaser svelte-f8idzx");
    			add_location(div1, file$6, 57, 1, 1367);
    			attr_dev(div2, "class", "blg-el-wrapper svelte-f8idzx");
    			add_location(div2, file$6, 49, 0, 992);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, span0);
    			append_dev(span0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, span1);
    			append_dev(span1, t2);
    			append_dev(div2, t3);
    			append_dev(div2, h4);
    			append_dev(h4, t4);
    			append_dev(div2, t5);
    			append_dev(div2, div0);
    			append_dev(div0, span2);
    			append_dev(div0, t7);
    			append_dev(div0, h5);
    			append_dev(h5, t8);
    			append_dev(div2, t9);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*created_when*/ 8) set_data_dev(t0, /*created_when*/ ctx[3]);
    			if (dirty & /*updated_when*/ 4) set_data_dev(t2, /*updated_when*/ ctx[2]);
    			if (dirty & /*short_title*/ 16) set_data_dev(t4, /*short_title*/ ctx[4]);
    			if (dirty & /*short_subject*/ 32) set_data_dev(t8, /*short_subject*/ ctx[5]);

    			if (dirty & /*graphics*/ 2) {
    				each_value = /*graphics*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(49:0) {#if dates.created != 'never' }",
    		ctx
    	});

    	return block;
    }

    // (59:2) {#each graphics as grph}
    function create_each_block$3(ctx) {
    	let div;
    	let html_tag;
    	let raw_value = /*grph*/ ctx[11] + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			html_tag = new HtmlTag(t);
    			attr_dev(div, "class", "little-component svelte-f8idzx");
    			set_style(div, "height", "60px");
    			set_style(div, "width", "60px");
    			add_location(div, file$6, 59, 3, 1418);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			html_tag.m(raw_value, div);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*graphics*/ 2 && raw_value !== (raw_value = /*grph*/ ctx[11] + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(59:2) {#each graphics as grph}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*dates*/ ctx[0].created != "never") return create_if_block$3;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function convert_date$1(secsdate) {
    	if (secsdate === "never") {
    		return "never";
    	} else {
    		let idate = parseInt(secsdate);
    		let dformatted = new Date(idate).toLocaleDateString("en-US");
    		return dformatted;
    	}
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Thing", slots, []);
    	let { color } = $$props;
    	let { entry } = $$props;
    	let { business_id } = $$props;
    	let { dates } = $$props;
    	let { subject } = $$props;
    	let { components } = $$props;
    	let graphics;
    	let updated_when;
    	let created_when;
    	let short_title;
    	let short_subject;
    	const writable_props = ["color", "entry", "business_id", "dates", "subject", "components"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Thing> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("color" in $$props) $$invalidate(6, color = $$props.color);
    		if ("entry" in $$props) $$invalidate(7, entry = $$props.entry);
    		if ("business_id" in $$props) $$invalidate(8, business_id = $$props.business_id);
    		if ("dates" in $$props) $$invalidate(0, dates = $$props.dates);
    		if ("subject" in $$props) $$invalidate(9, subject = $$props.subject);
    		if ("components" in $$props) $$invalidate(10, components = $$props.components);
    	};

    	$$self.$capture_state = () => ({
    		color,
    		entry,
    		business_id,
    		dates,
    		subject,
    		components,
    		graphics,
    		convert_date: convert_date$1,
    		updated_when,
    		created_when,
    		short_title,
    		short_subject
    	});

    	$$self.$inject_state = $$props => {
    		if ("color" in $$props) $$invalidate(6, color = $$props.color);
    		if ("entry" in $$props) $$invalidate(7, entry = $$props.entry);
    		if ("business_id" in $$props) $$invalidate(8, business_id = $$props.business_id);
    		if ("dates" in $$props) $$invalidate(0, dates = $$props.dates);
    		if ("subject" in $$props) $$invalidate(9, subject = $$props.subject);
    		if ("components" in $$props) $$invalidate(10, components = $$props.components);
    		if ("graphics" in $$props) $$invalidate(1, graphics = $$props.graphics);
    		if ("updated_when" in $$props) $$invalidate(2, updated_when = $$props.updated_when);
    		if ("created_when" in $$props) $$invalidate(3, created_when = $$props.created_when);
    		if ("short_title" in $$props) $$invalidate(4, short_title = $$props.short_title);
    		if ("short_subject" in $$props) $$invalidate(5, short_subject = $$props.short_subject);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*components*/ 1024) {
    			$$invalidate(1, graphics = components.graphic.map(grph => {
    				return decodeURIComponent(grph);
    			}));
    		}

    		if ($$self.$$.dirty & /*dates*/ 1) {
    			$$invalidate(2, updated_when = convert_date$1(dates.updated));
    		}

    		if ($$self.$$.dirty & /*dates*/ 1) {
    			$$invalidate(3, created_when = convert_date$1(dates.created));
    		}

    		if ($$self.$$.dirty & /*business_id*/ 256) {
    			$$invalidate(4, short_title = business_id.substr(0, 16) + "...");
    		}

    		if ($$self.$$.dirty & /*subject*/ 512) {
    			$$invalidate(5, short_subject = subject.substr(0, 32) + "...");
    		}
    	};

    	return [
    		dates,
    		graphics,
    		updated_when,
    		created_when,
    		short_title,
    		short_subject,
    		color,
    		entry,
    		business_id,
    		subject,
    		components
    	];
    }

    class Thing extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			color: 6,
    			entry: 7,
    			business_id: 8,
    			dates: 0,
    			subject: 9,
    			components: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Thing",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*color*/ ctx[6] === undefined && !("color" in props)) {
    			console.warn("<Thing> was created without expected prop 'color'");
    		}

    		if (/*entry*/ ctx[7] === undefined && !("entry" in props)) {
    			console.warn("<Thing> was created without expected prop 'entry'");
    		}

    		if (/*business_id*/ ctx[8] === undefined && !("business_id" in props)) {
    			console.warn("<Thing> was created without expected prop 'business_id'");
    		}

    		if (/*dates*/ ctx[0] === undefined && !("dates" in props)) {
    			console.warn("<Thing> was created without expected prop 'dates'");
    		}

    		if (/*subject*/ ctx[9] === undefined && !("subject" in props)) {
    			console.warn("<Thing> was created without expected prop 'subject'");
    		}

    		if (/*components*/ ctx[10] === undefined && !("components" in props)) {
    			console.warn("<Thing> was created without expected prop 'components'");
    		}
    	}

    	get color() {
    		throw new Error("<Thing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Thing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get entry() {
    		throw new Error("<Thing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set entry(value) {
    		throw new Error("<Thing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get business_id() {
    		throw new Error("<Thing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set business_id(value) {
    		throw new Error("<Thing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dates() {
    		throw new Error("<Thing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dates(value) {
    		throw new Error("<Thing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subject() {
    		throw new Error("<Thing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subject(value) {
    		throw new Error("<Thing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get components() {
    		throw new Error("<Thing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set components(value) {
    		throw new Error("<Thing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ThingGrid.svelte generated by Svelte v3.37.0 */
    const file$5 = "src/ThingGrid.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (39:2) {#each things as thing (thing.id)}
    function create_each_block$2(key_1, ctx) {
    	let div;
    	let thing;
    	let t;
    	let div_id_value;
    	let current;
    	let mounted;
    	let dispose;
    	const thing_spread_levels = [/*thing*/ ctx[4]];
    	let thing_props = {};

    	for (let i = 0; i < thing_spread_levels.length; i += 1) {
    		thing_props = assign(thing_props, thing_spread_levels[i]);
    	}

    	thing = new Thing({ props: thing_props, $$inline: true });

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(thing.$$.fragment);
    			t = space();
    			attr_dev(div, "id", div_id_value = "xy_" + /*thing*/ ctx[4].id);
    			attr_dev(div, "class", "element-poster svelte-1pia6v3");
    			add_location(div, file$5, 39, 3, 637);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(thing, div, null);
    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*do_display*/ ctx[1], false, false, false),
    					listen_dev(div, "mouseover", /*show_titles*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			const thing_changes = (dirty & /*things*/ 1)
    			? get_spread_update(thing_spread_levels, [get_spread_object(/*thing*/ ctx[4])])
    			: {};

    			thing.$set(thing_changes);

    			if (!current || dirty & /*things*/ 1 && div_id_value !== (div_id_value = "xy_" + /*thing*/ ctx[4].id)) {
    				attr_dev(div, "id", div_id_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(thing.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(thing.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(thing);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(39:2) {#each things as thing (thing.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*things*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*thing*/ ctx[4].id;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "grid-container svelte-1pia6v3");
    			add_location(div, file$5, 35, 0, 565);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*things, do_display, show_titles*/ 7) {
    				each_value = /*things*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ThingGrid", slots, []);
    	let { things } = $$props;
    	const dispatch = createEventDispatcher();

    	function do_display(event) {
    		let tid = event.currentTarget.id;

    		//console.log(tid)
    		dispatch("message", { type: "click", text: "click " + tid });
    	}

    	function show_titles(event) {
    		let tid = event.currentTarget.id;

    		//console.log(tid)
    		dispatch("message", { type: "over", text: "over " + tid });
    	}

    	const writable_props = ["things"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ThingGrid> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("things" in $$props) $$invalidate(0, things = $$props.things);
    	};

    	$$self.$capture_state = () => ({
    		things,
    		Thing,
    		createEventDispatcher,
    		dispatch,
    		do_display,
    		show_titles
    	});

    	$$self.$inject_state = $$props => {
    		if ("things" in $$props) $$invalidate(0, things = $$props.things);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [things, do_display, show_titles];
    }

    class ThingGrid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { things: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ThingGrid",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*things*/ ctx[0] === undefined && !("things" in props)) {
    			console.warn("<ThingGrid> was created without expected prop 'things'");
    		}
    	}

    	get things() {
    		throw new Error("<ThingGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set things(value) {
    		throw new Error("<ThingGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/FloatWindow.svelte generated by Svelte v3.37.0 */
    const file$4 = "src/FloatWindow.svelte";

    // (111:0) {#if use_smoke }
    function create_if_block$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "...";
    			attr_dev(div, "id", "smoke");
    			attr_dev(div, "class", "smoke svelte-6mxcwp");
    			add_location(div, file$4, 111, 0, 2672);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(111:0) {#if use_smoke }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let t0;
    	let div1;
    	let div0;
    	let t1;
    	let t2;
    	let span;
    	let t4;
    	let p;
    	let t6;
    	let current;
    	let if_block = /*use_smoke*/ ctx[1] && create_if_block$2(ctx);
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t1 = text(/*title*/ ctx[0]);
    			t2 = space();
    			span = element("span");
    			span.textContent = "[X]";
    			t4 = space();
    			p = element("p");
    			p.textContent = "Press ESC to close window.";
    			t6 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(span, "id", "btn_close");
    			attr_dev(span, "class", "btn_close svelte-6mxcwp");
    			add_location(span, file$4, 116, 3, 2806);
    			attr_dev(div0, "id", "popup_bar");
    			attr_dev(div0, "class", "popup_bar svelte-6mxcwp");
    			add_location(div0, file$4, 114, 1, 2752);
    			set_style(p, "font-size", "0.75em");
    			set_style(p, "font-weight", "bold");
    			set_style(p, "color", "darkgreen");
    			set_style(p, "padding-left", "4px");
    			add_location(p, file$4, 118, 2, 2867);
    			attr_dev(div1, "id", "popup");
    			attr_dev(div1, "class", "popup svelte-6mxcwp");
    			add_location(div1, file$4, 113, 0, 2718);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, span);
    			append_dev(div1, t4);
    			append_dev(div1, p);
    			append_dev(div1, t6);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*use_smoke*/ ctx[1]) {
    				if (if_block) ; else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*title*/ 1) set_data_dev(t1, /*title*/ ctx[0]);

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function fix_height(startup_delta) {
    	let txt_area = document.getElementById("blg-window-full-text");

    	if (txt_area) {
    		//
    		txt_area._blg_app_resized = true;

    		//
    		let r = txt_area.getBoundingClientRect();

    		//
    		if (popup) {
    			let rp = popup.getBoundingClientRect();
    			let h = Math.floor(rp.bottom - r.top) - startup_delta;
    			txt_area.style.height = h + "px";
    		}
    	}
    }

    //-- / let the popup make draggable & movable.
    function spreadSmoke(flg) {
    	if (flg && smoke) {
    		if (smoke) smoke.style.width = window.outerWidth + 100 + "px";
    		if (smoke) smoke.style.height = window.outerHeight + 100 + "px";
    		if (smoke && flg != undefined && flg == true) smoke.style.display = "block";
    	}
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("FloatWindow", slots, ['default']);
    	let { title } = $$props;
    	let { scale_size } = $$props;
    	let { use_smoke = true } = $$props;
    	var SCROLL_WIDTH = 24;

    	// 
    	//-- let the popup make draggable & movable.
    	var offset = { x: 0, y: 0 };

    	onMount(() => {
    		//
    		var popup = document.getElementById("popup");

    		var popup_bar = document.getElementById("popup_bar");
    		var btn_close = document.getElementById("btn_close");
    		var smoke = document.getElementById("smoke");

    		//
    		popup_bar.addEventListener("mousedown", mouseDown, false);

    		window.addEventListener("mouseup", mouseUp, false);

    		window.onkeydown = function (e) {
    			if (e.keyCode == 27) {
    				// if ESC key pressed
    				btn_close.click(e);
    			}
    		};

    		btn_close.onclick = function (e) {
    			popup.style.display = "none";
    			if (smoke) smoke.style.display = "none";
    		};

    		window.addEventListener("resize", e => {
    			spreadSmoke(use_smoke);
    		});

    		window.start_floating_window = () => {
    			popup_starter();
    		};
    	});

    	function popup_starter() {
    		spreadSmoke(use_smoke);

    		if (popup.style.display !== "block") {
    			popup.style.top = "4px";
    			popup.style.left = "4px";
    			popup.style.width = window.innerWidth * scale_size.w - SCROLL_WIDTH + "px";
    			popup.style.height = window.innerHeight * scale_size.h - SCROLL_WIDTH + "px";
    			popup.style.display = "block";

    			setTimeout(
    				() => {
    					fix_height(4);
    				},
    				40
    			);
    		}

    		setTimeout(
    			() => {
    				fix_height(4);
    			},
    			20
    		);
    	}

    	function mouseUp() {
    		window.removeEventListener("mousemove", popupMove, true);
    	}

    	function mouseDown(e) {
    		offset.x = e.clientX - popup.offsetLeft;
    		offset.y = e.clientY - popup.offsetTop;
    		window.addEventListener("mousemove", popupMove, true);
    	}

    	function popupMove(e) {
    		popup.style.position = "absolute";
    		var top = e.clientY - offset.y;
    		var left = e.clientX - offset.x;
    		popup.style.top = top + "px";
    		popup.style.left = left + "px";
    	}

    	const writable_props = ["title", "scale_size", "use_smoke"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FloatWindow> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("scale_size" in $$props) $$invalidate(2, scale_size = $$props.scale_size);
    		if ("use_smoke" in $$props) $$invalidate(1, use_smoke = $$props.use_smoke);
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		scale_size,
    		use_smoke,
    		onMount,
    		SCROLL_WIDTH,
    		offset,
    		fix_height,
    		popup_starter,
    		mouseUp,
    		mouseDown,
    		popupMove,
    		spreadSmoke
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("scale_size" in $$props) $$invalidate(2, scale_size = $$props.scale_size);
    		if ("use_smoke" in $$props) $$invalidate(1, use_smoke = $$props.use_smoke);
    		if ("SCROLL_WIDTH" in $$props) SCROLL_WIDTH = $$props.SCROLL_WIDTH;
    		if ("offset" in $$props) offset = $$props.offset;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, use_smoke, scale_size, $$scope, slots];
    }

    class FloatWindow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { title: 0, scale_size: 2, use_smoke: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FloatWindow",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<FloatWindow> was created without expected prop 'title'");
    		}

    		if (/*scale_size*/ ctx[2] === undefined && !("scale_size" in props)) {
    			console.warn("<FloatWindow> was created without expected prop 'scale_size'");
    		}
    	}

    	get title() {
    		throw new Error("<FloatWindow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<FloatWindow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scale_size() {
    		throw new Error("<FloatWindow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale_size(value) {
    		throw new Error("<FloatWindow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get use_smoke() {
    		throw new Error("<FloatWindow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use_smoke(value) {
    		throw new Error("<FloatWindow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const debounce = (fn, ms = 0) => {
      let timeoutId;
      return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
      };
    };

    function getRowsCount$1(items, cols) {
      return Math.max(
        ...items.map((val) => {
          const item = val[cols];
          return (item && item.y) + (item && item.h);
        }),
        1,
      );
    }

    const getColumn = (containerWidth, columns) => {
      try {
        let [_, cols] = columns
          .slice()
          .reverse()
          .find((value) => {
            const [width, cols] = value;
            return containerWidth <= width;
          });
        return cols;
      } catch {
        return columns[columns.length - 1];
      }
    };

    function getContainerHeight(items, yPerPx, cols) {
      return getRowsCount$1(items, cols) * yPerPx;
    }

    const makeMatrix$1 = (rows, cols) => Array.from(Array(rows), () => new Array(cols)); // make 2d array

    function findCloseBlocks$1(items, matrix, curObject) {
      const { h, x, y } = curObject;

      const w = Math.min(matrix[0].length, curObject.w);
      const tempR = matrix.slice(y, y + h);

      let result = [];
      for (var i = 0; i < tempR.length; i++) {
        let tempA = tempR[i].slice(x, x + w);
        result = [...result, ...tempA.map((val) => val.id && val.id !== curObject.id && val.id).filter(Boolean)];
      }

      return [...new Set(result)];
    }

    function makeMatrixFromItemsIgnore$1(items, ignoreList, _row, _col) {
      let matrix = makeMatrix$1(_row, _col);
      for (var i = 0; i < items.length; i++) {
        const value = items[i][_col];
        const id = items[i].id;
        const { x, y, h } = value;
        const w = Math.min(_col, value.w);

        if (ignoreList.indexOf(id) === -1) {
          for (var j = y; j < y + h; j++) {
            const row = matrix[j];
            if (row) {
              for (var k = x; k < x + w; k++) {
                row[k] = { ...value, id };
              }
            }
          }
        }
      }
      return matrix;
    }

    function findItemsById$1(closeBlocks, items) {
      return items.filter((value) => closeBlocks.indexOf(value.id) !== -1);
    }

    function getItemById(id, items) {
      return items.find((value) => value.id === id);
    }

    function findFreeSpaceForItem$1(matrix, item, items = []) {
      const cols = matrix[0].length;
      const w = Math.min(cols, item.w);
      let xNtime = cols - w;

      for (var i = 0; i < matrix.length; i++) {
        const row = matrix[i];
        for (var j = 0; j < xNtime + 1; j++) {
          const sliceA = row.slice(j, j + w);
          const empty = sliceA.every((val) => val === undefined);
          if (empty) {
            const isEmpty = matrix.slice(i, i + item.h).every((a) => a.slice(j, j + w).every((n) => n === undefined));

            if (isEmpty) {
              return { y: i, x: j };
            }
          }
        }
      }

      return {
        y: getRowsCount$1(items, cols),
        x: 0,
      };
    }

    const getItem$1 = (item, col) => {
      return { ...item[col], id: item.id };
    };

    const updateItem$1 = (elements, active, position, col) => {
      return elements.map((value) => {
        if (value.id === active.id) {
          return { ...value, [col]: { ...value[col], ...position } };
        }
        return value;
      });
    };

    function moveItemsAroundItem(active, items, cols, original) {
      // Get current item from the breakpoint
      const activeItem = getItem$1(active, cols);
      const ids = items.map((value) => value.id).filter((value) => value !== activeItem.id);

      const els = items.filter((value) => value.id !== activeItem.id);

      // Update items
      let newItems = updateItem$1(items, active, activeItem, cols);

      let matrix = makeMatrixFromItemsIgnore$1(newItems, ids, getRowsCount$1(newItems, cols), cols);
      let tempItems = newItems;

      // Exclude resolved elements ids in array
      let exclude = [];

      els.forEach((item) => {
        // Find position for element
        let position = findFreeSpaceForItem$1(matrix, item[cols], tempItems);
        // Exclude item
        exclude.push(item.id);

        tempItems = updateItem$1(tempItems, item, position, cols);

        // Recreate ids of elements
        let getIgnoreItems = ids.filter((value) => exclude.indexOf(value) === -1);

        // Update matrix for next iteration
        matrix = makeMatrixFromItemsIgnore$1(tempItems, getIgnoreItems, getRowsCount$1(tempItems, cols), cols);
      });

      // Return result
      return tempItems;
    }

    function moveItem$1(active, items, cols, original) {
      // Get current item from the breakpoint
      const item = getItem$1(active, cols);
      // Create matrix from the items expect the active
      let matrix = makeMatrixFromItemsIgnore$1(items, [item.id], getRowsCount$1(items, cols), cols);
      // Getting the ids of items under active Array<String>
      const closeBlocks = findCloseBlocks$1(items, matrix, item);
      // Getting the objects of items under active Array<Object>
      let closeObj = findItemsById$1(closeBlocks, items);
      // Getting whenever of these items is fixed
      const fixed = closeObj.find((value) => value[cols].fixed);

      // If found fixed, reset the active to its original position
      if (fixed) return items;

      // Update items
      items = updateItem$1(items, active, item, cols);

      // Create matrix of items expect close elements
      matrix = makeMatrixFromItemsIgnore$1(items, closeBlocks, getRowsCount$1(items, cols), cols);

      // Create temp vars
      let tempItems = items;
      let tempCloseBlocks = closeBlocks;

      // Exclude resolved elements ids in array
      let exclude = [];

      // Iterate over close elements under active item
      closeObj.forEach((item) => {
        // Find position for element
        let position = findFreeSpaceForItem$1(matrix, item[cols], tempItems);
        // Exclude item
        exclude.push(item.id);

        // If position is found
        if (position) {
          // Assign the position to the element in the column
          tempItems = updateItem$1(tempItems, item, position, cols);

          // Recreate ids of elements
          let getIgnoreItems = tempCloseBlocks.filter((value) => exclude.indexOf(value) === -1);

          // Update matrix for next iteration
          matrix = makeMatrixFromItemsIgnore$1(tempItems, getIgnoreItems, getRowsCount$1(tempItems, cols), cols);
        }
      });

      // Return result
      return tempItems;
    }

    /* ../node_modules/svelte-grid/src/MoveResize/index.svelte generated by Svelte v3.37.0 */
    const file$3 = "../node_modules/svelte-grid/src/MoveResize/index.svelte";
    const get_default_slot_changes$1 = dirty => ({});
    const get_default_slot_context$1 = ctx => ({ pointerdown: /*pointerdown*/ ctx[14] });

    // (75:2) {#if resizable}
    function create_if_block_1$1(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "svlt-grid-resizer svelte-p5p96u");
    			add_location(div, file$3, 75, 4, 1694);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div, "pointerdown", /*resizePointerDown*/ ctx[15], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(75:2) {#if resizable}",
    		ctx
    	});

    	return block;
    }

    // (80:0) {#if active}
    function create_if_block$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "svlt-grid-shadow transition shadow-active svelte-p5p96u");
    			set_style(div, "width", /*shadow*/ ctx[11].w * /*xPerPx*/ ctx[6] - /*gapX*/ ctx[8] * 2 + "px");
    			set_style(div, "height", /*shadow*/ ctx[11].h * /*yPerPx*/ ctx[7] - /*gapY*/ ctx[9] * 2 + "px");
    			set_style(div, "transform", "translate(" + (/*shadow*/ ctx[11].x * /*xPerPx*/ ctx[6] + /*gapX*/ ctx[8]) + "px, " + (/*shadow*/ ctx[11].y * /*yPerPx*/ ctx[7] + /*gapY*/ ctx[9]) + "px)");
    			add_location(div, file$3, 80, 2, 1794);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*shadow, xPerPx, gapX*/ 2368) {
    				set_style(div, "width", /*shadow*/ ctx[11].w * /*xPerPx*/ ctx[6] - /*gapX*/ ctx[8] * 2 + "px");
    			}

    			if (dirty[0] & /*shadow, yPerPx, gapY*/ 2688) {
    				set_style(div, "height", /*shadow*/ ctx[11].h * /*yPerPx*/ ctx[7] - /*gapY*/ ctx[9] * 2 + "px");
    			}

    			if (dirty[0] & /*shadow, xPerPx, gapX, yPerPx, gapY*/ 3008) {
    				set_style(div, "transform", "translate(" + (/*shadow*/ ctx[11].x * /*xPerPx*/ ctx[6] + /*gapX*/ ctx[8]) + "px, " + (/*shadow*/ ctx[11].y * /*yPerPx*/ ctx[7] + /*gapY*/ ctx[9]) + "px)");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(80:0) {#if active}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block1_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[22].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], get_default_slot_context$1);
    	let if_block0 = /*resizable*/ ctx[4] && create_if_block_1$1(ctx);
    	let if_block1 = /*active*/ ctx[12] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(div, "class", "svlt-grid-item svelte-p5p96u");

    			set_style(div, "width", (/*active*/ ctx[12]
    			? /*cloneBound*/ ctx[13].width
    			: /*width*/ ctx[0]) + "px");

    			set_style(div, "height", (/*active*/ ctx[12]
    			? /*cloneBound*/ ctx[13].height
    			: /*height*/ ctx[1]) + "px");

    			set_style(div, "transform", "translate(" + (/*active*/ ctx[12]
    			? /*cloneBound*/ ctx[13].left
    			: /*left*/ ctx[2]) + "px, " + (/*active*/ ctx[12]
    			? /*cloneBound*/ ctx[13].top
    			: /*top*/ ctx[3]) + "px)");

    			toggle_class(div, "transition", !/*active*/ ctx[12]);
    			toggle_class(div, "active", /*active*/ ctx[12]);
    			toggle_class(div, "no-user", /*active*/ ctx[12]);
    			add_location(div, file$3, 66, 0, 1276);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t0);
    			if (if_block0) if_block0.m(div, null);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					div,
    					"pointerdown",
    					function () {
    						if (is_function(/*item*/ ctx[10] && /*item*/ ctx[10].custom
    						? null
    						: /*draggable*/ ctx[5] && /*pointerdown*/ ctx[14])) (/*item*/ ctx[10] && /*item*/ ctx[10].custom
    						? null
    						: /*draggable*/ ctx[5] && /*pointerdown*/ ctx[14]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 2097152) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[21], dirty, get_default_slot_changes$1, get_default_slot_context$1);
    				}
    			}

    			if (/*resizable*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(div, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!current || dirty[0] & /*active, cloneBound, width*/ 12289) {
    				set_style(div, "width", (/*active*/ ctx[12]
    				? /*cloneBound*/ ctx[13].width
    				: /*width*/ ctx[0]) + "px");
    			}

    			if (!current || dirty[0] & /*active, cloneBound, height*/ 12290) {
    				set_style(div, "height", (/*active*/ ctx[12]
    				? /*cloneBound*/ ctx[13].height
    				: /*height*/ ctx[1]) + "px");
    			}

    			if (!current || dirty[0] & /*active, cloneBound, left, top*/ 12300) {
    				set_style(div, "transform", "translate(" + (/*active*/ ctx[12]
    				? /*cloneBound*/ ctx[13].left
    				: /*left*/ ctx[2]) + "px, " + (/*active*/ ctx[12]
    				? /*cloneBound*/ ctx[13].top
    				: /*top*/ ctx[3]) + "px)");
    			}

    			if (dirty[0] & /*active*/ 4096) {
    				toggle_class(div, "transition", !/*active*/ ctx[12]);
    			}

    			if (dirty[0] & /*active*/ 4096) {
    				toggle_class(div, "active", /*active*/ ctx[12]);
    			}

    			if (dirty[0] & /*active*/ 4096) {
    				toggle_class(div, "no-user", /*active*/ ctx[12]);
    			}

    			if (/*active*/ ctx[12]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block0) if_block0.d();
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("MoveResize", slots, ['default']);
    	const dispatch = createEventDispatcher();
    	let { width } = $$props;
    	let { height } = $$props;
    	let { left } = $$props;
    	let { top } = $$props;
    	let { resizable } = $$props;
    	let { draggable } = $$props;
    	let { id } = $$props;
    	let { xPerPx } = $$props;
    	let { yPerPx } = $$props;
    	let { gapX } = $$props;
    	let { gapY } = $$props;
    	let { item } = $$props;
    	let { dynamic } = $$props;
    	let { max } = $$props;
    	let { min } = $$props;
    	let { cols } = $$props;
    	let shadow = {};
    	let active = false;
    	let debounce = false;
    	let initX, initY;
    	let xyRef = { x: left, y: top };
    	let newXY = { x: 0, y: 0 };
    	let cloneBound = { width, height, top, left };

    	const inActivate = () => {
    		$$invalidate(12, active = false);
    		dispatch("pointerup", { id });
    	};

    	let repaint = cb => {
    		dispatch("repaint", { id, shadow, onUpdate: cb });
    	};

    	beforeUpdate(() => {
    		if (xPerPx && !debounce && item) {
    			xyRef = { x: left, y: top };

    			$$invalidate(11, shadow = {
    				x: item.x,
    				y: item.y,
    				w: item.w,
    				h: item.h
    			});

    			debounce = true;
    		}
    	});

    	const pointerdown = ({ pageX, pageY, clientX, clientY }) => {
    		initX = pageX;
    		initY = pageY;
    		$$invalidate(13, cloneBound = { width, height, top, left });
    		debounce = false;
    		$$invalidate(12, active = true);
    		window.addEventListener("pointermove", pointermove);
    		window.addEventListener("pointerup", pointerup);
    		window.addEventListener("pointercancel", pointerup);
    	};

    	const pointermove = ({ pageX, pageY, clientX, clientY }) => {
    		newXY = { x: initX - pageX, y: initY - pageY };
    		$$invalidate(13, cloneBound.left = xyRef.x - newXY.x, cloneBound);
    		$$invalidate(13, cloneBound.top = xyRef.y - newXY.y, cloneBound);
    		let gridX = Math.round(cloneBound.left / xPerPx);
    		let gridY = Math.round(cloneBound.top / yPerPx);
    		$$invalidate(11, shadow.x = Math.max(Math.min(gridX, cols - shadow.w), 0), shadow);
    		$$invalidate(11, shadow.y = Math.max(gridY, 0), shadow);
    		if (dynamic) repaint();
    	};

    	const pointerup = e => {
    		xyRef.x -= newXY.x;
    		xyRef.y -= newXY.y;
    		window.removeEventListener("pointerdown", pointerdown);
    		window.removeEventListener("pointermove", pointermove);
    		window.removeEventListener("pointerup", pointerup);
    		window.removeEventListener("pointercancel", pointerup);
    		repaint(inActivate);
    	};

    	// Resize
    	let resizeInitX, resizeInitY;

    	let initialWidth = 0;
    	let initialHeight = 0;

    	const resizePointerDown = e => {
    		e.stopPropagation();
    		const { pageX, pageY } = e;
    		resizeInitX = pageX;
    		resizeInitY = pageY;
    		initialWidth = width;
    		initialHeight = height;
    		$$invalidate(13, cloneBound = { width, height, top, left });
    		$$invalidate(12, active = true);
    		const { x, y, w, h } = item;
    		$$invalidate(11, shadow = { x, y, w, h });
    		window.addEventListener("pointermove", resizePointerMove);
    		window.addEventListener("pointerup", resizePointerUp);
    		window.addEventListener("pointercancel", resizePointerUp);
    	};

    	const resizePointerMove = ({ pageX, pageY }) => {
    		$$invalidate(13, cloneBound.width = initialWidth + pageX - resizeInitX, cloneBound);
    		$$invalidate(13, cloneBound.height = initialHeight + pageY - resizeInitY, cloneBound);

    		// Get max col number
    		let maxWidth = cols - shadow.x;

    		maxWidth = Math.min(max.w, maxWidth) || maxWidth;

    		// Limit bound
    		$$invalidate(13, cloneBound.width = Math.max(Math.min(cloneBound.width, maxWidth * xPerPx - gapX * 2), min.w * xPerPx - gapX * 2), cloneBound);

    		$$invalidate(13, cloneBound.height = Math.max(cloneBound.height, min.h * yPerPx - gapY * 2), cloneBound);

    		if (max.h) {
    			$$invalidate(13, cloneBound.height = Math.min(cloneBound.height, max.h * yPerPx - gapY * 2), cloneBound);
    		}

    		// Limit col & row
    		$$invalidate(11, shadow.w = Math.round(cloneBound.width / xPerPx), shadow);

    		$$invalidate(11, shadow.h = Math.round(cloneBound.height / yPerPx), shadow);
    		if (dynamic) repaint();
    	};

    	const resizePointerUp = e => {
    		e.stopPropagation();
    		repaint(inActivate);
    		window.removeEventListener("pointermove", resizePointerMove);
    		window.removeEventListener("pointerup", resizePointerUp);
    		window.removeEventListener("pointercancel", resizePointerUp);
    	};

    	const writable_props = [
    		"width",
    		"height",
    		"left",
    		"top",
    		"resizable",
    		"draggable",
    		"id",
    		"xPerPx",
    		"yPerPx",
    		"gapX",
    		"gapY",
    		"item",
    		"dynamic",
    		"max",
    		"min",
    		"cols"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MoveResize> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("width" in $$props) $$invalidate(0, width = $$props.width);
    		if ("height" in $$props) $$invalidate(1, height = $$props.height);
    		if ("left" in $$props) $$invalidate(2, left = $$props.left);
    		if ("top" in $$props) $$invalidate(3, top = $$props.top);
    		if ("resizable" in $$props) $$invalidate(4, resizable = $$props.resizable);
    		if ("draggable" in $$props) $$invalidate(5, draggable = $$props.draggable);
    		if ("id" in $$props) $$invalidate(16, id = $$props.id);
    		if ("xPerPx" in $$props) $$invalidate(6, xPerPx = $$props.xPerPx);
    		if ("yPerPx" in $$props) $$invalidate(7, yPerPx = $$props.yPerPx);
    		if ("gapX" in $$props) $$invalidate(8, gapX = $$props.gapX);
    		if ("gapY" in $$props) $$invalidate(9, gapY = $$props.gapY);
    		if ("item" in $$props) $$invalidate(10, item = $$props.item);
    		if ("dynamic" in $$props) $$invalidate(17, dynamic = $$props.dynamic);
    		if ("max" in $$props) $$invalidate(18, max = $$props.max);
    		if ("min" in $$props) $$invalidate(19, min = $$props.min);
    		if ("cols" in $$props) $$invalidate(20, cols = $$props.cols);
    		if ("$$scope" in $$props) $$invalidate(21, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		beforeUpdate,
    		dispatch,
    		width,
    		height,
    		left,
    		top,
    		resizable,
    		draggable,
    		id,
    		xPerPx,
    		yPerPx,
    		gapX,
    		gapY,
    		item,
    		dynamic,
    		max,
    		min,
    		cols,
    		shadow,
    		active,
    		debounce,
    		initX,
    		initY,
    		xyRef,
    		newXY,
    		cloneBound,
    		inActivate,
    		repaint,
    		pointerdown,
    		pointermove,
    		pointerup,
    		resizeInitX,
    		resizeInitY,
    		initialWidth,
    		initialHeight,
    		resizePointerDown,
    		resizePointerMove,
    		resizePointerUp
    	});

    	$$self.$inject_state = $$props => {
    		if ("width" in $$props) $$invalidate(0, width = $$props.width);
    		if ("height" in $$props) $$invalidate(1, height = $$props.height);
    		if ("left" in $$props) $$invalidate(2, left = $$props.left);
    		if ("top" in $$props) $$invalidate(3, top = $$props.top);
    		if ("resizable" in $$props) $$invalidate(4, resizable = $$props.resizable);
    		if ("draggable" in $$props) $$invalidate(5, draggable = $$props.draggable);
    		if ("id" in $$props) $$invalidate(16, id = $$props.id);
    		if ("xPerPx" in $$props) $$invalidate(6, xPerPx = $$props.xPerPx);
    		if ("yPerPx" in $$props) $$invalidate(7, yPerPx = $$props.yPerPx);
    		if ("gapX" in $$props) $$invalidate(8, gapX = $$props.gapX);
    		if ("gapY" in $$props) $$invalidate(9, gapY = $$props.gapY);
    		if ("item" in $$props) $$invalidate(10, item = $$props.item);
    		if ("dynamic" in $$props) $$invalidate(17, dynamic = $$props.dynamic);
    		if ("max" in $$props) $$invalidate(18, max = $$props.max);
    		if ("min" in $$props) $$invalidate(19, min = $$props.min);
    		if ("cols" in $$props) $$invalidate(20, cols = $$props.cols);
    		if ("shadow" in $$props) $$invalidate(11, shadow = $$props.shadow);
    		if ("active" in $$props) $$invalidate(12, active = $$props.active);
    		if ("debounce" in $$props) debounce = $$props.debounce;
    		if ("initX" in $$props) initX = $$props.initX;
    		if ("initY" in $$props) initY = $$props.initY;
    		if ("xyRef" in $$props) xyRef = $$props.xyRef;
    		if ("newXY" in $$props) newXY = $$props.newXY;
    		if ("cloneBound" in $$props) $$invalidate(13, cloneBound = $$props.cloneBound);
    		if ("repaint" in $$props) repaint = $$props.repaint;
    		if ("resizeInitX" in $$props) resizeInitX = $$props.resizeInitX;
    		if ("resizeInitY" in $$props) resizeInitY = $$props.resizeInitY;
    		if ("initialWidth" in $$props) initialWidth = $$props.initialWidth;
    		if ("initialHeight" in $$props) initialHeight = $$props.initialHeight;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		width,
    		height,
    		left,
    		top,
    		resizable,
    		draggable,
    		xPerPx,
    		yPerPx,
    		gapX,
    		gapY,
    		item,
    		shadow,
    		active,
    		cloneBound,
    		pointerdown,
    		resizePointerDown,
    		id,
    		dynamic,
    		max,
    		min,
    		cols,
    		$$scope,
    		slots
    	];
    }

    class MoveResize extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$3,
    			create_fragment$3,
    			safe_not_equal,
    			{
    				width: 0,
    				height: 1,
    				left: 2,
    				top: 3,
    				resizable: 4,
    				draggable: 5,
    				id: 16,
    				xPerPx: 6,
    				yPerPx: 7,
    				gapX: 8,
    				gapY: 9,
    				item: 10,
    				dynamic: 17,
    				max: 18,
    				min: 19,
    				cols: 20
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MoveResize",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*width*/ ctx[0] === undefined && !("width" in props)) {
    			console.warn("<MoveResize> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[1] === undefined && !("height" in props)) {
    			console.warn("<MoveResize> was created without expected prop 'height'");
    		}

    		if (/*left*/ ctx[2] === undefined && !("left" in props)) {
    			console.warn("<MoveResize> was created without expected prop 'left'");
    		}

    		if (/*top*/ ctx[3] === undefined && !("top" in props)) {
    			console.warn("<MoveResize> was created without expected prop 'top'");
    		}

    		if (/*resizable*/ ctx[4] === undefined && !("resizable" in props)) {
    			console.warn("<MoveResize> was created without expected prop 'resizable'");
    		}

    		if (/*draggable*/ ctx[5] === undefined && !("draggable" in props)) {
    			console.warn("<MoveResize> was created without expected prop 'draggable'");
    		}

    		if (/*id*/ ctx[16] === undefined && !("id" in props)) {
    			console.warn("<MoveResize> was created without expected prop 'id'");
    		}

    		if (/*xPerPx*/ ctx[6] === undefined && !("xPerPx" in props)) {
    			console.warn("<MoveResize> was created without expected prop 'xPerPx'");
    		}

    		if (/*yPerPx*/ ctx[7] === undefined && !("yPerPx" in props)) {
    			console.warn("<MoveResize> was created without expected prop 'yPerPx'");
    		}

    		if (/*gapX*/ ctx[8] === undefined && !("gapX" in props)) {
    			console.warn("<MoveResize> was created without expected prop 'gapX'");
    		}

    		if (/*gapY*/ ctx[9] === undefined && !("gapY" in props)) {
    			console.warn("<MoveResize> was created without expected prop 'gapY'");
    		}

    		if (/*item*/ ctx[10] === undefined && !("item" in props)) {
    			console.warn("<MoveResize> was created without expected prop 'item'");
    		}

    		if (/*dynamic*/ ctx[17] === undefined && !("dynamic" in props)) {
    			console.warn("<MoveResize> was created without expected prop 'dynamic'");
    		}

    		if (/*max*/ ctx[18] === undefined && !("max" in props)) {
    			console.warn("<MoveResize> was created without expected prop 'max'");
    		}

    		if (/*min*/ ctx[19] === undefined && !("min" in props)) {
    			console.warn("<MoveResize> was created without expected prop 'min'");
    		}

    		if (/*cols*/ ctx[20] === undefined && !("cols" in props)) {
    			console.warn("<MoveResize> was created without expected prop 'cols'");
    		}
    	}

    	get width() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get left() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get top() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get resizable() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set resizable(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get draggable() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set draggable(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xPerPx() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xPerPx(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yPerPx() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yPerPx(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gapX() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gapX(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gapY() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gapY(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get item() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dynamic() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dynamic(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cols() {
    		throw new Error("<MoveResize>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cols(value) {
    		throw new Error("<MoveResize>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ../node_modules/svelte-grid/src/index.svelte generated by Svelte v3.37.0 */
    const file$2 = "../node_modules/svelte-grid/src/index.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	child_ctx[30] = i;
    	return child_ctx;
    }

    const get_default_slot_changes = dirty => ({
    	pointerdown: dirty[1] & /*pointerdown*/ 1,
    	dataItem: dirty[0] & /*items*/ 1,
    	item: dirty[0] & /*items, getComputedCols*/ 9,
    	index: dirty[0] & /*items*/ 1
    });

    const get_default_slot_context = ctx => ({
    	pointerdown: /*pointerdown*/ ctx[31],
    	dataItem: /*item*/ ctx[28],
    	item: /*item*/ ctx[28][/*getComputedCols*/ ctx[3]],
    	index: /*i*/ ctx[30]
    });

    // (8:2) {#if xPerPx || !fastStart}
    function create_if_block(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*items*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[28].id;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*items, getComputedCols, xPerPx, yPerPx, gapX, gapY, dynamic, handleRepaint, pointerup, $$scope*/ 8392429 | dirty[1] & /*pointerdown*/ 1) {
    				each_value = /*items*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$1, each_1_anchor, get_each_context$1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(8:2) {#if xPerPx || !fastStart}",
    		ctx
    	});

    	return block;
    }

    // (30:8) {#if item[getComputedCols]}
    function create_if_block_1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[21].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[23], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope, items, getComputedCols*/ 8388617 | dirty[1] & /*pointerdown*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[23], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(30:8) {#if item[getComputedCols]}",
    		ctx
    	});

    	return block;
    }

    // (10:6) <MoveResize         on:repaint={handleRepaint}         on:pointerup={pointerup}         id={item.id}         resizable={item[getComputedCols] && item[getComputedCols].resizable}         draggable={item[getComputedCols] && item[getComputedCols].draggable}         {xPerPx}         {yPerPx}         width={Math.min(getComputedCols, item[getComputedCols] && item[getComputedCols].w) * xPerPx - gapX * 2}         height={(item[getComputedCols] && item[getComputedCols].h) * yPerPx - gapY * 2}         top={(item[getComputedCols] && item[getComputedCols].y) * yPerPx + gapY}         left={(item[getComputedCols] && item[getComputedCols].x) * xPerPx + gapX}         item={item[getComputedCols]}         min={item[getComputedCols] && item[getComputedCols].min}         max={item[getComputedCols] && item[getComputedCols].max}         {dynamic}         cols={getComputedCols}         {gapX}         {gapY}         let:pointerdown>
    function create_default_slot$2(ctx) {
    	let t;
    	let current;
    	let if_block = /*item*/ ctx[28][/*getComputedCols*/ ctx[3]] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*item*/ ctx[28][/*getComputedCols*/ ctx[3]]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*items, getComputedCols*/ 9) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(10:6) <MoveResize         on:repaint={handleRepaint}         on:pointerup={pointerup}         id={item.id}         resizable={item[getComputedCols] && item[getComputedCols].resizable}         draggable={item[getComputedCols] && item[getComputedCols].draggable}         {xPerPx}         {yPerPx}         width={Math.min(getComputedCols, item[getComputedCols] && item[getComputedCols].w) * xPerPx - gapX * 2}         height={(item[getComputedCols] && item[getComputedCols].h) * yPerPx - gapY * 2}         top={(item[getComputedCols] && item[getComputedCols].y) * yPerPx + gapY}         left={(item[getComputedCols] && item[getComputedCols].x) * xPerPx + gapX}         item={item[getComputedCols]}         min={item[getComputedCols] && item[getComputedCols].min}         max={item[getComputedCols] && item[getComputedCols].max}         {dynamic}         cols={getComputedCols}         {gapX}         {gapY}         let:pointerdown>",
    		ctx
    	});

    	return block;
    }

    // (9:4) {#each items as item, i (item.id)}
    function create_each_block$1(key_1, ctx) {
    	let first;
    	let moveresize;
    	let current;

    	moveresize = new MoveResize({
    			props: {
    				id: /*item*/ ctx[28].id,
    				resizable: /*item*/ ctx[28][/*getComputedCols*/ ctx[3]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[3]].resizable,
    				draggable: /*item*/ ctx[28][/*getComputedCols*/ ctx[3]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[3]].draggable,
    				xPerPx: /*xPerPx*/ ctx[5],
    				yPerPx: /*yPerPx*/ ctx[9],
    				width: Math.min(/*getComputedCols*/ ctx[3], /*item*/ ctx[28][/*getComputedCols*/ ctx[3]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[3]].w) * /*xPerPx*/ ctx[5] - /*gapX*/ ctx[6] * 2,
    				height: (/*item*/ ctx[28][/*getComputedCols*/ ctx[3]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[3]].h) * /*yPerPx*/ ctx[9] - /*gapY*/ ctx[7] * 2,
    				top: (/*item*/ ctx[28][/*getComputedCols*/ ctx[3]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[3]].y) * /*yPerPx*/ ctx[9] + /*gapY*/ ctx[7],
    				left: (/*item*/ ctx[28][/*getComputedCols*/ ctx[3]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[3]].x) * /*xPerPx*/ ctx[5] + /*gapX*/ ctx[6],
    				item: /*item*/ ctx[28][/*getComputedCols*/ ctx[3]],
    				min: /*item*/ ctx[28][/*getComputedCols*/ ctx[3]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[3]].min,
    				max: /*item*/ ctx[28][/*getComputedCols*/ ctx[3]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[3]].max,
    				dynamic: /*dynamic*/ ctx[2],
    				cols: /*getComputedCols*/ ctx[3],
    				gapX: /*gapX*/ ctx[6],
    				gapY: /*gapY*/ ctx[7],
    				$$slots: {
    					default: [
    						create_default_slot$2,
    						({ pointerdown }) => ({ 31: pointerdown }),
    						({ pointerdown }) => [0, pointerdown ? 1 : 0]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	moveresize.$on("repaint", /*handleRepaint*/ ctx[11]);
    	moveresize.$on("pointerup", /*pointerup*/ ctx[10]);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(moveresize.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(moveresize, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const moveresize_changes = {};
    			if (dirty[0] & /*items*/ 1) moveresize_changes.id = /*item*/ ctx[28].id;
    			if (dirty[0] & /*items, getComputedCols*/ 9) moveresize_changes.resizable = /*item*/ ctx[28][/*getComputedCols*/ ctx[3]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[3]].resizable;
    			if (dirty[0] & /*items, getComputedCols*/ 9) moveresize_changes.draggable = /*item*/ ctx[28][/*getComputedCols*/ ctx[3]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[3]].draggable;
    			if (dirty[0] & /*xPerPx*/ 32) moveresize_changes.xPerPx = /*xPerPx*/ ctx[5];
    			if (dirty[0] & /*getComputedCols, items, xPerPx, gapX*/ 105) moveresize_changes.width = Math.min(/*getComputedCols*/ ctx[3], /*item*/ ctx[28][/*getComputedCols*/ ctx[3]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[3]].w) * /*xPerPx*/ ctx[5] - /*gapX*/ ctx[6] * 2;
    			if (dirty[0] & /*items, getComputedCols, gapY*/ 137) moveresize_changes.height = (/*item*/ ctx[28][/*getComputedCols*/ ctx[3]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[3]].h) * /*yPerPx*/ ctx[9] - /*gapY*/ ctx[7] * 2;
    			if (dirty[0] & /*items, getComputedCols, gapY*/ 137) moveresize_changes.top = (/*item*/ ctx[28][/*getComputedCols*/ ctx[3]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[3]].y) * /*yPerPx*/ ctx[9] + /*gapY*/ ctx[7];
    			if (dirty[0] & /*items, getComputedCols, xPerPx, gapX*/ 105) moveresize_changes.left = (/*item*/ ctx[28][/*getComputedCols*/ ctx[3]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[3]].x) * /*xPerPx*/ ctx[5] + /*gapX*/ ctx[6];
    			if (dirty[0] & /*items, getComputedCols*/ 9) moveresize_changes.item = /*item*/ ctx[28][/*getComputedCols*/ ctx[3]];
    			if (dirty[0] & /*items, getComputedCols*/ 9) moveresize_changes.min = /*item*/ ctx[28][/*getComputedCols*/ ctx[3]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[3]].min;
    			if (dirty[0] & /*items, getComputedCols*/ 9) moveresize_changes.max = /*item*/ ctx[28][/*getComputedCols*/ ctx[3]] && /*item*/ ctx[28][/*getComputedCols*/ ctx[3]].max;
    			if (dirty[0] & /*dynamic*/ 4) moveresize_changes.dynamic = /*dynamic*/ ctx[2];
    			if (dirty[0] & /*getComputedCols*/ 8) moveresize_changes.cols = /*getComputedCols*/ ctx[3];
    			if (dirty[0] & /*gapX*/ 64) moveresize_changes.gapX = /*gapX*/ ctx[6];
    			if (dirty[0] & /*gapY*/ 128) moveresize_changes.gapY = /*gapY*/ ctx[7];

    			if (dirty[0] & /*$$scope, items, getComputedCols*/ 8388617 | dirty[1] & /*pointerdown*/ 1) {
    				moveresize_changes.$$scope = { dirty, ctx };
    			}

    			moveresize.$set(moveresize_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(moveresize.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(moveresize.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(moveresize, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(9:4) {#each items as item, i (item.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let current;
    	let if_block = (/*xPerPx*/ ctx[5] || !/*fastStart*/ ctx[1]) && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "svlt-grid-container svelte-p0xk9p");
    			set_style(div, "height", /*containerHeight*/ ctx[8] + "px");
    			add_location(div, file$2, 6, 0, 71);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			/*div_binding*/ ctx[22](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*xPerPx*/ ctx[5] || !/*fastStart*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*xPerPx, fastStart*/ 34) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*containerHeight*/ 256) {
    				set_style(div, "height", /*containerHeight*/ ctx[8] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			/*div_binding*/ ctx[22](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let gapX;
    	let gapY;
    	let containerHeight;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Src", slots, ['default']);
    	const dispatch = createEventDispatcher();
    	let { fillSpace = false } = $$props;
    	let { items } = $$props;
    	let { rowHeight } = $$props;
    	let { cols } = $$props;
    	let { gap = [10, 10] } = $$props;
    	let { dynamicCols = true } = $$props;
    	let { fastStart = false } = $$props;
    	let { debounceUpdate = 100 } = $$props;
    	let { debounceResize = 100 } = $$props;
    	let { dynamic = false } = $$props;
    	let getComputedCols;
    	let container;
    	let xPerPx = 0;
    	let yPerPx = rowHeight;
    	let documentWidth;
    	let containerWidth;
    	let prevCols;

    	const pointerup = ev => {
    		dispatch("pointerup", { id: ev.detail.id, cols: getComputedCols });
    	};

    	const onResize = debounce(
    		() => {
    			dispatch("resize", {
    				cols: getComputedCols,
    				xPerPx,
    				yPerPx,
    				width: containerWidth
    			});
    		},
    		debounceResize
    	);

    	onMount(() => {
    		const sizeObserver = new ResizeObserver(entries => {
    				let width = entries[0].contentRect.width;
    				if (width === containerWidth) return;
    				$$invalidate(3, getComputedCols = getColumn(width, cols));
    				$$invalidate(5, xPerPx = width / getComputedCols);

    				if (!containerWidth) {
    					dispatch("mount", {
    						cols: getComputedCols,
    						xPerPx,
    						yPerPx, // same as rowHeight
    						
    					});
    				} else {
    					onResize();
    				}

    				$$invalidate(19, containerWidth = width);
    			});

    		sizeObserver.observe(container);
    		return () => sizeObserver.disconnect();
    	});

    	const updateMatrix = ({ detail }) => {
    		let activeItem = getItemById(detail.id, items);

    		if (activeItem) {
    			activeItem = {
    				...activeItem,
    				[getComputedCols]: {
    					...activeItem[getComputedCols],
    					...detail.shadow
    				}
    			};

    			if (fillSpace) {
    				$$invalidate(0, items = moveItemsAroundItem(activeItem, items, getComputedCols, getItemById(detail.id, items)));
    			} else {
    				$$invalidate(0, items = moveItem$1(activeItem, items, getComputedCols, getItemById(detail.id, items)));
    			}

    			if (detail.onUpdate) detail.onUpdate();

    			dispatch("change", {
    				unsafeItem: activeItem,
    				id: activeItem.id,
    				cols: getComputedCols
    			});
    		}
    	};

    	const handleRepaint = debounce(updateMatrix, debounceUpdate);

    	const writable_props = [
    		"fillSpace",
    		"items",
    		"rowHeight",
    		"cols",
    		"gap",
    		"dynamicCols",
    		"fastStart",
    		"debounceUpdate",
    		"debounceResize",
    		"dynamic"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Src> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			container = $$value;
    			$$invalidate(4, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("fillSpace" in $$props) $$invalidate(12, fillSpace = $$props.fillSpace);
    		if ("items" in $$props) $$invalidate(0, items = $$props.items);
    		if ("rowHeight" in $$props) $$invalidate(13, rowHeight = $$props.rowHeight);
    		if ("cols" in $$props) $$invalidate(14, cols = $$props.cols);
    		if ("gap" in $$props) $$invalidate(15, gap = $$props.gap);
    		if ("dynamicCols" in $$props) $$invalidate(16, dynamicCols = $$props.dynamicCols);
    		if ("fastStart" in $$props) $$invalidate(1, fastStart = $$props.fastStart);
    		if ("debounceUpdate" in $$props) $$invalidate(17, debounceUpdate = $$props.debounceUpdate);
    		if ("debounceResize" in $$props) $$invalidate(18, debounceResize = $$props.debounceResize);
    		if ("dynamic" in $$props) $$invalidate(2, dynamic = $$props.dynamic);
    		if ("$$scope" in $$props) $$invalidate(23, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContainerHeight,
    		moveItemsAroundItem,
    		moveItem: moveItem$1,
    		getItemById,
    		onMount,
    		createEventDispatcher,
    		debounce,
    		getColumn,
    		MoveResize,
    		dispatch,
    		fillSpace,
    		items,
    		rowHeight,
    		cols,
    		gap,
    		dynamicCols,
    		fastStart,
    		debounceUpdate,
    		debounceResize,
    		dynamic,
    		getComputedCols,
    		container,
    		xPerPx,
    		yPerPx,
    		documentWidth,
    		containerWidth,
    		prevCols,
    		pointerup,
    		onResize,
    		updateMatrix,
    		handleRepaint,
    		gapX,
    		gapY,
    		containerHeight
    	});

    	$$self.$inject_state = $$props => {
    		if ("fillSpace" in $$props) $$invalidate(12, fillSpace = $$props.fillSpace);
    		if ("items" in $$props) $$invalidate(0, items = $$props.items);
    		if ("rowHeight" in $$props) $$invalidate(13, rowHeight = $$props.rowHeight);
    		if ("cols" in $$props) $$invalidate(14, cols = $$props.cols);
    		if ("gap" in $$props) $$invalidate(15, gap = $$props.gap);
    		if ("dynamicCols" in $$props) $$invalidate(16, dynamicCols = $$props.dynamicCols);
    		if ("fastStart" in $$props) $$invalidate(1, fastStart = $$props.fastStart);
    		if ("debounceUpdate" in $$props) $$invalidate(17, debounceUpdate = $$props.debounceUpdate);
    		if ("debounceResize" in $$props) $$invalidate(18, debounceResize = $$props.debounceResize);
    		if ("dynamic" in $$props) $$invalidate(2, dynamic = $$props.dynamic);
    		if ("getComputedCols" in $$props) $$invalidate(3, getComputedCols = $$props.getComputedCols);
    		if ("container" in $$props) $$invalidate(4, container = $$props.container);
    		if ("xPerPx" in $$props) $$invalidate(5, xPerPx = $$props.xPerPx);
    		if ("yPerPx" in $$props) $$invalidate(9, yPerPx = $$props.yPerPx);
    		if ("documentWidth" in $$props) documentWidth = $$props.documentWidth;
    		if ("containerWidth" in $$props) $$invalidate(19, containerWidth = $$props.containerWidth);
    		if ("prevCols" in $$props) $$invalidate(20, prevCols = $$props.prevCols);
    		if ("gapX" in $$props) $$invalidate(6, gapX = $$props.gapX);
    		if ("gapY" in $$props) $$invalidate(7, gapY = $$props.gapY);
    		if ("containerHeight" in $$props) $$invalidate(8, containerHeight = $$props.containerHeight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*gap*/ 32768) {
    			$$invalidate(6, [gapX, gapY] = gap, gapX, ($$invalidate(7, gapY), $$invalidate(15, gap)));
    		}

    		if ($$self.$$.dirty[0] & /*items, getComputedCols*/ 9) {
    			$$invalidate(8, containerHeight = getContainerHeight(items, yPerPx, getComputedCols));
    		}

    		if ($$self.$$.dirty[0] & /*prevCols, cols, dynamicCols, containerWidth*/ 1654784) {
    			{
    				if (prevCols !== cols && dynamicCols) {
    					$$invalidate(5, xPerPx = containerWidth / cols);
    				}

    				$$invalidate(20, prevCols = cols);
    			}
    		}
    	};

    	return [
    		items,
    		fastStart,
    		dynamic,
    		getComputedCols,
    		container,
    		xPerPx,
    		gapX,
    		gapY,
    		containerHeight,
    		yPerPx,
    		pointerup,
    		handleRepaint,
    		fillSpace,
    		rowHeight,
    		cols,
    		gap,
    		dynamicCols,
    		debounceUpdate,
    		debounceResize,
    		containerWidth,
    		prevCols,
    		slots,
    		div_binding,
    		$$scope
    	];
    }

    class Src extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$2,
    			create_fragment$2,
    			safe_not_equal,
    			{
    				fillSpace: 12,
    				items: 0,
    				rowHeight: 13,
    				cols: 14,
    				gap: 15,
    				dynamicCols: 16,
    				fastStart: 1,
    				debounceUpdate: 17,
    				debounceResize: 18,
    				dynamic: 2
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Src",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*items*/ ctx[0] === undefined && !("items" in props)) {
    			console.warn("<Src> was created without expected prop 'items'");
    		}

    		if (/*rowHeight*/ ctx[13] === undefined && !("rowHeight" in props)) {
    			console.warn("<Src> was created without expected prop 'rowHeight'");
    		}

    		if (/*cols*/ ctx[14] === undefined && !("cols" in props)) {
    			console.warn("<Src> was created without expected prop 'cols'");
    		}
    	}

    	get fillSpace() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fillSpace(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rowHeight() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rowHeight(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cols() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cols(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gap() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gap(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dynamicCols() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dynamicCols(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fastStart() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fastStart(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get debounceUpdate() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set debounceUpdate(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get debounceResize() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set debounceResize(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dynamic() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dynamic(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/TopicMessages.svelte generated by Svelte v3.37.0 */
    const file$1 = "src/TopicMessages.svelte";

    // (69:0) <Grid bind:items={items} rowHeight={rowHeight} let:item  let:index let:dataItem {cols} fillSpace={fillFree}>
    function create_default_slot$1(ctx) {
    	let div1;
    	let t0_value = /*dataItem*/ ctx[22].id + "";
    	let t0;
    	let t1;
    	let div0;
    	let raw_value = /*graphs*/ ctx[6][/*index*/ ctx[21]] + "";

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");
    			attr_dev(div0, "class", "graph svelte-d3bz02");
    			add_location(div0, file$1, 71, 2, 1596);
    			attr_dev(div1, "class", "content svelte-d3bz02");
    			add_location(div1, file$1, 69, 2, 1556);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			div0.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataItem*/ 4194304 && t0_value !== (t0_value = /*dataItem*/ ctx[22].id + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*graphs, index*/ 2097216 && raw_value !== (raw_value = /*graphs*/ ctx[6][/*index*/ ctx[21]] + "")) div0.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(69:0) <Grid bind:items={items} rowHeight={rowHeight} let:item  let:index let:dataItem {cols} fillSpace={fillFree}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div2;
    	let div0;
    	let button;
    	let t1;
    	let input;
    	let t2;
    	let t3_value = (/*fillFree*/ ctx[7] ? "enabled" : "disabled") + "";
    	let t3;
    	let t4;
    	let div1;
    	let span0;
    	let t5;
    	let t6;
    	let span1;
    	let t7;
    	let t8;
    	let span2;
    	let t9;
    	let t10;
    	let span3;
    	let t11;
    	let t12;
    	let div3;
    	let t13;
    	let grid;
    	let updating_items;
    	let current;
    	let mounted;
    	let dispose;

    	function grid_items_binding(value) {
    		/*grid_items_binding*/ ctx[19](value);
    	}

    	let grid_props = {
    		rowHeight: /*rowHeight*/ ctx[2],
    		cols: /*cols*/ ctx[1],
    		fillSpace: /*fillFree*/ ctx[7],
    		$$slots: {
    			default: [
    				create_default_slot$1,
    				({ item, index, dataItem }) => ({ 20: item, 21: index, 22: dataItem }),
    				({ item, index, dataItem }) => (item ? 1048576 : 0) | (index ? 2097152 : 0) | (dataItem ? 4194304 : 0)
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*items*/ ctx[0] !== void 0) {
    		grid_props.items = /*items*/ ctx[0];
    	}

    	grid = new Src({ props: grid_props, $$inline: true });
    	binding_callbacks.push(() => bind(grid, "items", grid_items_binding));

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			button = element("button");
    			button.textContent = "readme";
    			t1 = space();
    			input = element("input");
    			t2 = text("\n\t  'Fill space' is ");
    			t3 = text(t3_value);
    			t4 = space();
    			div1 = element("div");
    			span0 = element("span");
    			t5 = text(/*entry*/ ctx[4]);
    			t6 = space();
    			span1 = element("span");
    			t7 = text(/*created_when*/ ctx[9]);
    			t8 = space();
    			span2 = element("span");
    			t9 = text(/*updated_when*/ ctx[8]);
    			t10 = space();
    			span3 = element("span");
    			t11 = text(/*short_title*/ ctx[10]);
    			t12 = space();
    			div3 = element("div");
    			t13 = space();
    			create_component(grid.$$.fragment);
    			attr_dev(button, "class", "svelte-d3bz02");
    			add_location(button, file$1, 54, 1, 842);
    			attr_dev(input, "type", "checkbox");
    			add_location(input, file$1, 55, 4, 897);
    			attr_dev(div0, "class", "view-ctrl svelte-d3bz02");
    			add_location(div0, file$1, 53, 2, 816);
    			set_style(span0, "background-color", /*color*/ ctx[3]);
    			attr_dev(span0, "class", "svelte-d3bz02");
    			add_location(span0, file$1, 59, 4, 1052);
    			set_style(span1, "background-color", "yellowgreen");
    			attr_dev(span1, "class", "svelte-d3bz02");
    			add_location(span1, file$1, 60, 2, 1109);
    			set_style(span2, "background-color", "lightblue");
    			attr_dev(span2, "class", "svelte-d3bz02");
    			add_location(span2, file$1, 61, 2, 1177);
    			attr_dev(span3, "class", "blg-item-title svelte-d3bz02");
    			set_style(span3, "background-color", "inherit");
    			add_location(span3, file$1, 62, 2, 1243);
    			set_style(div1, "display", "inline-block");
    			add_location(div1, file$1, 58, 3, 1013);
    			attr_dev(div2, "class", "container-head svelte-d3bz02");
    			add_location(div2, file$1, 52, 0, 785);
    			attr_dev(div3, "class", "description svelte-d3bz02");
    			set_style(div3, "display", /*descr_on*/ ctx[11] ? "block" : "none");
    			add_location(div3, file$1, 65, 0, 1345);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, button);
    			append_dev(div0, t1);
    			append_dev(div0, input);
    			input.checked = /*fillFree*/ ctx[7];
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, span0);
    			append_dev(span0, t5);
    			append_dev(div1, t6);
    			append_dev(div1, span1);
    			append_dev(span1, t7);
    			append_dev(div1, t8);
    			append_dev(div1, span2);
    			append_dev(span2, t9);
    			append_dev(div1, t10);
    			append_dev(div1, span3);
    			append_dev(span3, t11);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, div3, anchor);
    			div3.innerHTML = /*txt_full*/ ctx[5];
    			insert_dev(target, t13, anchor);
    			mount_component(grid, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*handle_readme*/ ctx[12], false, false, false),
    					listen_dev(input, "change", /*input_change_handler*/ ctx[18])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*fillFree*/ 128) {
    				input.checked = /*fillFree*/ ctx[7];
    			}

    			if ((!current || dirty & /*fillFree*/ 128) && t3_value !== (t3_value = (/*fillFree*/ ctx[7] ? "enabled" : "disabled") + "")) set_data_dev(t3, t3_value);
    			if (!current || dirty & /*entry*/ 16) set_data_dev(t5, /*entry*/ ctx[4]);

    			if (!current || dirty & /*color*/ 8) {
    				set_style(span0, "background-color", /*color*/ ctx[3]);
    			}

    			if (!current || dirty & /*created_when*/ 512) set_data_dev(t7, /*created_when*/ ctx[9]);
    			if (!current || dirty & /*updated_when*/ 256) set_data_dev(t9, /*updated_when*/ ctx[8]);
    			if (!current || dirty & /*short_title*/ 1024) set_data_dev(t11, /*short_title*/ ctx[10]);
    			if (!current || dirty & /*txt_full*/ 32) div3.innerHTML = /*txt_full*/ ctx[5];
    			if (!current || dirty & /*descr_on*/ 2048) {
    				set_style(div3, "display", /*descr_on*/ ctx[11] ? "block" : "none");
    			}

    			const grid_changes = {};
    			if (dirty & /*rowHeight*/ 4) grid_changes.rowHeight = /*rowHeight*/ ctx[2];
    			if (dirty & /*cols*/ 2) grid_changes.cols = /*cols*/ ctx[1];
    			if (dirty & /*fillFree*/ 128) grid_changes.fillSpace = /*fillFree*/ ctx[7];

    			if (dirty & /*$$scope, graphs, index, dataItem*/ 14680128) {
    				grid_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_items && dirty & /*items*/ 1) {
    				updating_items = true;
    				grid_changes.items = /*items*/ ctx[0];
    				add_flush_callback(() => updating_items = false);
    			}

    			grid.$set(grid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t13);
    			destroy_component(grid, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function convert_date(secsdate) {
    	if (secsdate === "never") {
    		return "never";
    	} else {
    		let idate = parseInt(secsdate);
    		let dformatted = new Date(idate).toLocaleDateString("en-US");
    		return dformatted;
    	}
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TopicMessages", slots, []);
    	let { items } = $$props;
    	let { cols } = $$props;
    	let { rowHeight } = $$props;
    	let { color } = $$props;
    	let { entry } = $$props;
    	let { title } = $$props;
    	let { dates } = $$props;
    	let { subject } = $$props;
    	let { keys } = $$props;
    	let { t_type } = $$props;
    	let { txt_full } = $$props;
    	let { graphs } = $$props;
    	let fillFree = true;
    	let updated_when;
    	let created_when;
    	let short_title;
    	let descr_on = false;

    	function handle_readme(ev) {
    		$$invalidate(11, descr_on = !descr_on);
    	}

    	const writable_props = [
    		"items",
    		"cols",
    		"rowHeight",
    		"color",
    		"entry",
    		"title",
    		"dates",
    		"subject",
    		"keys",
    		"t_type",
    		"txt_full",
    		"graphs"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TopicMessages> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		fillFree = this.checked;
    		$$invalidate(7, fillFree);
    	}

    	function grid_items_binding(value) {
    		items = value;
    		$$invalidate(0, items);
    	}

    	$$self.$$set = $$props => {
    		if ("items" in $$props) $$invalidate(0, items = $$props.items);
    		if ("cols" in $$props) $$invalidate(1, cols = $$props.cols);
    		if ("rowHeight" in $$props) $$invalidate(2, rowHeight = $$props.rowHeight);
    		if ("color" in $$props) $$invalidate(3, color = $$props.color);
    		if ("entry" in $$props) $$invalidate(4, entry = $$props.entry);
    		if ("title" in $$props) $$invalidate(13, title = $$props.title);
    		if ("dates" in $$props) $$invalidate(14, dates = $$props.dates);
    		if ("subject" in $$props) $$invalidate(15, subject = $$props.subject);
    		if ("keys" in $$props) $$invalidate(16, keys = $$props.keys);
    		if ("t_type" in $$props) $$invalidate(17, t_type = $$props.t_type);
    		if ("txt_full" in $$props) $$invalidate(5, txt_full = $$props.txt_full);
    		if ("graphs" in $$props) $$invalidate(6, graphs = $$props.graphs);
    	};

    	$$self.$capture_state = () => ({
    		Grid: Src,
    		items,
    		cols,
    		rowHeight,
    		color,
    		entry,
    		title,
    		dates,
    		subject,
    		keys,
    		t_type,
    		txt_full,
    		graphs,
    		fillFree,
    		convert_date,
    		updated_when,
    		created_when,
    		short_title,
    		descr_on,
    		handle_readme
    	});

    	$$self.$inject_state = $$props => {
    		if ("items" in $$props) $$invalidate(0, items = $$props.items);
    		if ("cols" in $$props) $$invalidate(1, cols = $$props.cols);
    		if ("rowHeight" in $$props) $$invalidate(2, rowHeight = $$props.rowHeight);
    		if ("color" in $$props) $$invalidate(3, color = $$props.color);
    		if ("entry" in $$props) $$invalidate(4, entry = $$props.entry);
    		if ("title" in $$props) $$invalidate(13, title = $$props.title);
    		if ("dates" in $$props) $$invalidate(14, dates = $$props.dates);
    		if ("subject" in $$props) $$invalidate(15, subject = $$props.subject);
    		if ("keys" in $$props) $$invalidate(16, keys = $$props.keys);
    		if ("t_type" in $$props) $$invalidate(17, t_type = $$props.t_type);
    		if ("txt_full" in $$props) $$invalidate(5, txt_full = $$props.txt_full);
    		if ("graphs" in $$props) $$invalidate(6, graphs = $$props.graphs);
    		if ("fillFree" in $$props) $$invalidate(7, fillFree = $$props.fillFree);
    		if ("updated_when" in $$props) $$invalidate(8, updated_when = $$props.updated_when);
    		if ("created_when" in $$props) $$invalidate(9, created_when = $$props.created_when);
    		if ("short_title" in $$props) $$invalidate(10, short_title = $$props.short_title);
    		if ("descr_on" in $$props) $$invalidate(11, descr_on = $$props.descr_on);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*dates*/ 16384) {
    			$$invalidate(8, updated_when = convert_date(dates.updated));
    		}

    		if ($$self.$$.dirty & /*dates*/ 16384) {
    			$$invalidate(9, created_when = convert_date(dates.created));
    		}

    		if ($$self.$$.dirty & /*title*/ 8192) {
    			$$invalidate(10, short_title = title.substr(0, 45));
    		}
    	};

    	return [
    		items,
    		cols,
    		rowHeight,
    		color,
    		entry,
    		txt_full,
    		graphs,
    		fillFree,
    		updated_when,
    		created_when,
    		short_title,
    		descr_on,
    		handle_readme,
    		title,
    		dates,
    		subject,
    		keys,
    		t_type,
    		input_change_handler,
    		grid_items_binding
    	];
    }

    class TopicMessages extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			items: 0,
    			cols: 1,
    			rowHeight: 2,
    			color: 3,
    			entry: 4,
    			title: 13,
    			dates: 14,
    			subject: 15,
    			keys: 16,
    			t_type: 17,
    			txt_full: 5,
    			graphs: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopicMessages",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*items*/ ctx[0] === undefined && !("items" in props)) {
    			console.warn("<TopicMessages> was created without expected prop 'items'");
    		}

    		if (/*cols*/ ctx[1] === undefined && !("cols" in props)) {
    			console.warn("<TopicMessages> was created without expected prop 'cols'");
    		}

    		if (/*rowHeight*/ ctx[2] === undefined && !("rowHeight" in props)) {
    			console.warn("<TopicMessages> was created without expected prop 'rowHeight'");
    		}

    		if (/*color*/ ctx[3] === undefined && !("color" in props)) {
    			console.warn("<TopicMessages> was created without expected prop 'color'");
    		}

    		if (/*entry*/ ctx[4] === undefined && !("entry" in props)) {
    			console.warn("<TopicMessages> was created without expected prop 'entry'");
    		}

    		if (/*title*/ ctx[13] === undefined && !("title" in props)) {
    			console.warn("<TopicMessages> was created without expected prop 'title'");
    		}

    		if (/*dates*/ ctx[14] === undefined && !("dates" in props)) {
    			console.warn("<TopicMessages> was created without expected prop 'dates'");
    		}

    		if (/*subject*/ ctx[15] === undefined && !("subject" in props)) {
    			console.warn("<TopicMessages> was created without expected prop 'subject'");
    		}

    		if (/*keys*/ ctx[16] === undefined && !("keys" in props)) {
    			console.warn("<TopicMessages> was created without expected prop 'keys'");
    		}

    		if (/*t_type*/ ctx[17] === undefined && !("t_type" in props)) {
    			console.warn("<TopicMessages> was created without expected prop 't_type'");
    		}

    		if (/*txt_full*/ ctx[5] === undefined && !("txt_full" in props)) {
    			console.warn("<TopicMessages> was created without expected prop 'txt_full'");
    		}

    		if (/*graphs*/ ctx[6] === undefined && !("graphs" in props)) {
    			console.warn("<TopicMessages> was created without expected prop 'graphs'");
    		}
    	}

    	get items() {
    		throw new Error("<TopicMessages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<TopicMessages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cols() {
    		throw new Error("<TopicMessages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cols(value) {
    		throw new Error("<TopicMessages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rowHeight() {
    		throw new Error("<TopicMessages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rowHeight(value) {
    		throw new Error("<TopicMessages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<TopicMessages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<TopicMessages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get entry() {
    		throw new Error("<TopicMessages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set entry(value) {
    		throw new Error("<TopicMessages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<TopicMessages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<TopicMessages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dates() {
    		throw new Error("<TopicMessages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dates(value) {
    		throw new Error("<TopicMessages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subject() {
    		throw new Error("<TopicMessages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subject(value) {
    		throw new Error("<TopicMessages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get keys() {
    		throw new Error("<TopicMessages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keys(value) {
    		throw new Error("<TopicMessages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get t_type() {
    		throw new Error("<TopicMessages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set t_type(value) {
    		throw new Error("<TopicMessages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get txt_full() {
    		throw new Error("<TopicMessages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set txt_full(value) {
    		throw new Error("<TopicMessages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get graphs() {
    		throw new Error("<TopicMessages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set graphs(value) {
    		throw new Error("<TopicMessages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function getRowsCount(items, cols) {
      return Math.max(
        ...items.map((val) => {
          const item = val[cols];
          return (item && item.y) + (item && item.h);
        }),
        1,
      );
    }

    const makeMatrix = (rows, cols) => Array.from(Array(rows), () => new Array(cols)); // make 2d array

    function makeMatrixFromItems(items, _row, _col) {
      let matrix = makeMatrix(_row, _col);

      for (var i = 0; i < items.length; i++) {
        const value = items[i][_col];
        const { x, y, h } = value;
        const id = items[i].id;
        const w = Math.min(_col, value.w);

        for (var j = y; j < y + h; j++) {
          const row = matrix[j];
          for (var k = x; k < x + w; k++) {
            row[k] = { ...value, id };
          }
        }
      }
      return matrix;
    }

    function findCloseBlocks(items, matrix, curObject) {
      const { h, x, y } = curObject;

      const w = Math.min(matrix[0].length, curObject.w);
      const tempR = matrix.slice(y, y + h);

      let result = [];
      for (var i = 0; i < tempR.length; i++) {
        let tempA = tempR[i].slice(x, x + w);
        result = [...result, ...tempA.map((val) => val.id && val.id !== curObject.id && val.id).filter(Boolean)];
      }

      return [...new Set(result)];
    }

    function makeMatrixFromItemsIgnore(items, ignoreList, _row, _col) {
      let matrix = makeMatrix(_row, _col);
      for (var i = 0; i < items.length; i++) {
        const value = items[i][_col];
        const id = items[i].id;
        const { x, y, h } = value;
        const w = Math.min(_col, value.w);

        if (ignoreList.indexOf(id) === -1) {
          for (var j = y; j < y + h; j++) {
            const row = matrix[j];
            if (row) {
              for (var k = x; k < x + w; k++) {
                row[k] = { ...value, id };
              }
            }
          }
        }
      }
      return matrix;
    }

    function findItemsById(closeBlocks, items) {
      return items.filter((value) => closeBlocks.indexOf(value.id) !== -1);
    }

    function findFreeSpaceForItem(matrix, item, items = []) {
      const cols = matrix[0].length;
      const w = Math.min(cols, item.w);
      let xNtime = cols - w;

      for (var i = 0; i < matrix.length; i++) {
        const row = matrix[i];
        for (var j = 0; j < xNtime + 1; j++) {
          const sliceA = row.slice(j, j + w);
          const empty = sliceA.every((val) => val === undefined);
          if (empty) {
            const isEmpty = matrix.slice(i, i + item.h).every((a) => a.slice(j, j + w).every((n) => n === undefined));

            if (isEmpty) {
              return { y: i, x: j };
            }
          }
        }
      }

      return {
        y: getRowsCount(items, cols),
        x: 0,
      };
    }

    const getItem = (item, col) => {
      return { ...item[col], id: item.id };
    };

    const updateItem = (elements, active, position, col) => {
      return elements.map((value) => {
        if (value.id === active.id) {
          return { ...value, [col]: { ...value[col], ...position } };
        }
        return value;
      });
    };

    function moveItem(active, items, cols, original) {
      // Get current item from the breakpoint
      const item = getItem(active, cols);
      // Create matrix from the items expect the active
      let matrix = makeMatrixFromItemsIgnore(items, [item.id], getRowsCount(items, cols), cols);
      // Getting the ids of items under active Array<String>
      const closeBlocks = findCloseBlocks(items, matrix, item);
      // Getting the objects of items under active Array<Object>
      let closeObj = findItemsById(closeBlocks, items);
      // Getting whenever of these items is fixed
      const fixed = closeObj.find((value) => value[cols].fixed);

      // If found fixed, reset the active to its original position
      if (fixed) return items;

      // Update items
      items = updateItem(items, active, item, cols);

      // Create matrix of items expect close elements
      matrix = makeMatrixFromItemsIgnore(items, closeBlocks, getRowsCount(items, cols), cols);

      // Create temp vars
      let tempItems = items;
      let tempCloseBlocks = closeBlocks;

      // Exclude resolved elements ids in array
      let exclude = [];

      // Iterate over close elements under active item
      closeObj.forEach((item) => {
        // Find position for element
        let position = findFreeSpaceForItem(matrix, item[cols], tempItems);
        // Exclude item
        exclude.push(item.id);

        // If position is found
        if (position) {
          // Assign the position to the element in the column
          tempItems = updateItem(tempItems, item, position, cols);

          // Recreate ids of elements
          let getIgnoreItems = tempCloseBlocks.filter((value) => exclude.indexOf(value) === -1);

          // Update matrix for next iteration
          matrix = makeMatrixFromItemsIgnore(tempItems, getIgnoreItems, getRowsCount(tempItems, cols), cols);
        }
      });

      // Return result
      return tempItems;
    }

    // Helper function
    function normalize(items, col) {
      let result = items.slice();

      result.forEach((value) => {
        const getItem = value[col];
        if (!getItem.static) {
          result = moveItem(getItem, result, col);
        }
      });

      return result;
    }

    // Helper function
    function adjust(items, col) {
      let matrix = makeMatrix(getRowsCount(items, col), col);

      let res = [];

      items.forEach((item) => {
        let position = findFreeSpaceForItem(matrix, item[col], items);

        res.push({
          ...item,
          [col]: {
            ...item[col],
            ...position,
          },
        });

        matrix = makeMatrixFromItems(res, getRowsCount(res, col), col);
      });

      return res;
    }

    function makeItem(item) {
      const { min = { w: 1, h: 1 }, max } = item;
      return {
        fixed: false,
        resizable: !item.fixed,
        draggable: !item.fixed,
        min: {
          w: Math.max(1, min.w),
          h: Math.max(1, min.h),
        },
        max: { ...max },
        ...item,
      };
    }

    const gridHelp = {
      normalize(items, col) {
        getRowsCount(items, col);
        return normalize(items, col);
      },

      adjust(items, col) {
        return adjust(items, col);
      },

      item(obj) {
        return makeItem(obj);
      },

      findSpace(item, items, cols) {
        let matrix = makeMatrixFromItems(items, getRowsCount(items, cols), cols);

        let position = findFreeSpaceForItem(matrix, item[cols], items);
        return position;
      },
    };

    // ----
    let g_search_table = {};
    let g_when_table = {};
    let g_all_keys = [];

    let g_prune_timeout = null;

    const TIMEOUT_THRESHHOLD = 4*60*60;

    // got this from somewhere
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }


    function gen_unique_id() {
        let ky = uuidv4();
        while ( g_all_keys.indexOf(ky) >= 0 ) ky = uuidv4();
        return ky
    } 

    function prune_old_keys() {
        //
        let deleters = [];
        let tcheck = Date.now();
        for ( let ky in g_search_table ) {
            let was_when = g_when_table[ky];
            if ( (tcheck - was_when) > TIMEOUT_THRESHHOLD ) {
                deleters.push(ky);
            }
        }
        deleters.forEach((ky) => {
            delete g_when_table[ky];
            delete g_search_table[ky];
        });

        deleters = [];  // push it along
    }


    function add_search(key) {
        if ( g_all_keys.length >= 200 ) {
            if ( g_prune_timeout === null ) {
                g_prune_timeout = setTimeout(prune_old_keys,60000*10);
            }
        }
        let uid = gen_unique_id();
        g_search_table[key] = uid; // writes over old seaches
        g_when_table[key] = Date.now();
        g_all_keys = Object.keys(g_search_table);
        return(uid)
    }


    function get_search(key,add_if_new = false) {

        if ( key in g_search_table ) {
            return(g_search_table[key])
        }
        if ( add_if_new ) {
            return(add_search(key))
        }
    }

    /* src/App.svelte generated by Svelte v3.37.0 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[48] = list[i];
    	return child_ctx;
    }

    // (497:4) {#each qlist_ordering as ordering}
    function create_each_block(ctx) {
    	let option;
    	let t0_value = /*ordering*/ ctx[48].text + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = /*ordering*/ ctx[48];
    			option.value = option.__value;
    			add_location(option, file, 497, 5, 10943);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(497:4) {#each qlist_ordering as ordering}",
    		ctx
    	});

    	return block;
    }

    // (517:0) <FloatWindow title={current_thing.title.substr(0,g_max_title_chars) + '...'} scale_size={window_scale} use_smoke={false}>
    function create_default_slot(ctx) {
    	let topicmessages;
    	let current;

    	const topicmessages_spread_levels = [
    		/*current_thing*/ ctx[7],
    		{ items: /*items*/ ctx[1] },
    		{ graphs: /*component_graphs*/ ctx[2] },
    		{ cols: /*cols*/ ctx[0] },
    		{ rowHeight: 50 }
    	];

    	let topicmessages_props = {};

    	for (let i = 0; i < topicmessages_spread_levels.length; i += 1) {
    		topicmessages_props = assign(topicmessages_props, topicmessages_spread_levels[i]);
    	}

    	topicmessages = new TopicMessages({
    			props: topicmessages_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(topicmessages.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(topicmessages, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const topicmessages_changes = (dirty[0] & /*current_thing, items, component_graphs, cols*/ 135)
    			? get_spread_update(topicmessages_spread_levels, [
    					dirty[0] & /*current_thing*/ 128 && get_spread_object(/*current_thing*/ ctx[7]),
    					dirty[0] & /*items*/ 2 && { items: /*items*/ ctx[1] },
    					dirty[0] & /*component_graphs*/ 4 && { graphs: /*component_graphs*/ ctx[2] },
    					dirty[0] & /*cols*/ 1 && { cols: /*cols*/ ctx[0] },
    					topicmessages_spread_levels[4]
    				])
    			: {};

    			topicmessages.$set(topicmessages_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topicmessages.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topicmessages.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(topicmessages, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(517:0) <FloatWindow title={current_thing.title.substr(0,g_max_title_chars) + '...'} scale_size={window_scale} use_smoke={false}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div10;
    	let div5;
    	let div0;
    	let span;
    	let t1;
    	let input0;
    	let t2;
    	let button0;
    	let t4;
    	let button1;
    	let t6;
    	let div2;
    	let button2;
    	let t8;
    	let div1;
    	let t9;
    	let input1;
    	let t10;
    	let div3;
    	let button3;
    	let t12;
    	let input2;
    	let t13;
    	let button4;
    	let t15;
    	let input3;
    	let t16;
    	let t17;
    	let t18;
    	let div4;
    	let select;
    	let t19;
    	let div8;
    	let div6;
    	let t20;
    	let t21;
    	let div7;
    	let t22;
    	let t23;
    	let t24;
    	let div9;
    	let thinggrid;
    	let t25;
    	let floatwindow;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*qlist_ordering*/ ctx[13];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	thinggrid = new ThingGrid({
    			props: { things: /*things*/ ctx[9] },
    			$$inline: true
    		});

    	thinggrid.$on("message", /*handleMessage*/ ctx[15]);

    	floatwindow = new FloatWindow({
    			props: {
    				title: /*current_thing*/ ctx[7].title.substr(0, /*g_max_title_chars*/ ctx[14]) + "...",
    				scale_size: /*window_scale*/ ctx[8],
    				use_smoke: false,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "Boxes";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			button0 = element("button");
    			button0.textContent = "-";
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "+";
    			t6 = space();
    			div2 = element("div");
    			button2 = element("button");
    			button2.textContent = "search";
    			t8 = space();
    			div1 = element("div");
    			t9 = text(" ");
    			input1 = element("input");
    			t10 = space();
    			div3 = element("div");
    			button3 = element("button");
    			button3.textContent = "≤";
    			t12 = space();
    			input2 = element("input");
    			t13 = space();
    			button4 = element("button");
    			button4.textContent = "≥";
    			t15 = space();
    			input3 = element("input");
    			t16 = text("\n\t\t\tof ");
    			t17 = text(/*article_count*/ ctx[10]);
    			t18 = space();
    			div4 = element("div");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t19 = space();
    			div8 = element("div");
    			div6 = element("div");
    			t20 = text("Title: ");
    			t21 = text(/*current_roller_title*/ ctx[5]);
    			div7 = element("div");
    			t22 = text("Subject: ");
    			t23 = text(/*current_roller_subject*/ ctx[6]);
    			t24 = space();
    			div9 = element("div");
    			create_component(thinggrid.$$.fragment);
    			t25 = space();
    			create_component(floatwindow.$$.fragment);
    			set_style(span, "color", "navy");
    			set_style(span, "font-weight", "bold");
    			add_location(span, file, 467, 3, 9560);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "class", "blg-ctl-number-field svelte-5vaqzo");
    			attr_dev(input0, "min", "1");
    			attr_dev(input0, "max", "4");
    			add_location(input0, file, 468, 3, 9618);
    			attr_dev(button0, "class", "blg-ctl-button svelte-5vaqzo");
    			add_location(button0, file, 470, 3, 9706);
    			attr_dev(button1, "class", "blg-ctl-button svelte-5vaqzo");
    			add_location(button1, file, 474, 3, 9791);
    			attr_dev(div0, "class", "blg-ctrl-panel svelte-5vaqzo");
    			set_style(div0, "display", "inline-block");
    			set_style(div0, "vertical-align", "bottom");
    			set_style(div0, "background-color", "#EFFFFE");
    			add_location(div0, file, 466, 2, 9451);
    			add_location(button2, file, 479, 3, 9990);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file, 483, 9, 10100);
    			set_style(div1, "display", "inline-block");
    			add_location(div1, file, 482, 3, 10055);
    			attr_dev(div2, "class", "blg-ctrl-panel svelte-5vaqzo");
    			set_style(div2, "display", "inline-block");
    			set_style(div2, "vertical-align", "bottom");
    			set_style(div2, "background-color", "#EFEFFE");
    			add_location(div2, file, 478, 2, 9881);
    			attr_dev(button3, "class", "blg-ctl-button svelte-5vaqzo");
    			add_location(button3, file, 488, 3, 10286);
    			attr_dev(input2, "class", "blg-ctl-slider svelte-5vaqzo");
    			attr_dev(input2, "type", "range");
    			attr_dev(input2, "min", "1");
    			attr_dev(input2, "max", /*article_count*/ ctx[10]);
    			add_location(input2, file, 489, 3, 10363);
    			attr_dev(button4, "class", "blg-ctl-button svelte-5vaqzo");
    			add_location(button4, file, 490, 3, 10495);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "class", "blg-ctl-number-field svelte-5vaqzo");
    			attr_dev(input3, "min", "1");
    			attr_dev(input3, "max", /*article_count*/ ctx[10]);
    			add_location(input3, file, 491, 3, 10571);
    			attr_dev(div3, "class", "blg-ctrl-panel svelte-5vaqzo");
    			set_style(div3, "display", "inline-block");
    			set_style(div3, "background-color", "#FFFFFA");
    			add_location(div3, file, 486, 2, 10195);
    			if (/*search_ordering*/ ctx[3] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[29].call(select));
    			add_location(select, file, 495, 3, 10827);
    			attr_dev(div4, "class", "blg-ctrl-panel svelte-5vaqzo");
    			set_style(div4, "display", "inline-block");
    			set_style(div4, "background-color", "#FFFFFA");
    			add_location(div4, file, 494, 2, 10740);
    			set_style(div5, "border", "solid 2px navy");
    			set_style(div5, "padding", "4px");
    			set_style(div5, "background-color", "#EFEFEF");
    			add_location(div5, file, 465, 1, 9373);
    			attr_dev(div6, "class", "sel-titles svelte-5vaqzo");
    			add_location(div6, file, 505, 2, 11127);
    			attr_dev(div7, "class", "sel-titles svelte-5vaqzo");
    			add_location(div7, file, 505, 62, 11187);
    			set_style(div8, "border", "solid 1px grey");
    			set_style(div8, "padding", "4px");
    			set_style(div8, "background-color", "#F5F6EF");
    			add_location(div8, file, 504, 1, 11049);
    			attr_dev(div9, "class", "blg-grid-container svelte-5vaqzo");
    			add_location(div9, file, 508, 1, 11263);
    			add_location(div10, file, 463, 0, 9365);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div5);
    			append_dev(div5, div0);
    			append_dev(div0, span);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			set_input_value(input0, /*box_delta*/ ctx[12]);
    			append_dev(div0, t2);
    			append_dev(div0, button0);
    			append_dev(div0, t4);
    			append_dev(div0, button1);
    			append_dev(div5, t6);
    			append_dev(div5, div2);
    			append_dev(div2, button2);
    			append_dev(div2, t8);
    			append_dev(div2, div1);
    			append_dev(div1, t9);
    			append_dev(div1, input1);
    			set_input_value(input1, /*search_topic*/ ctx[4]);
    			append_dev(div5, t10);
    			append_dev(div5, div3);
    			append_dev(div3, button3);
    			append_dev(div3, t12);
    			append_dev(div3, input2);
    			set_input_value(input2, /*article_index*/ ctx[11]);
    			append_dev(div3, t13);
    			append_dev(div3, button4);
    			append_dev(div3, t15);
    			append_dev(div3, input3);
    			set_input_value(input3, /*article_index*/ ctx[11]);
    			append_dev(div3, t16);
    			append_dev(div3, t17);
    			append_dev(div5, t18);
    			append_dev(div5, div4);
    			append_dev(div4, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*search_ordering*/ ctx[3]);
    			append_dev(div10, t19);
    			append_dev(div10, div8);
    			append_dev(div8, div6);
    			append_dev(div6, t20);
    			append_dev(div6, t21);
    			append_dev(div8, div7);
    			append_dev(div7, t22);
    			append_dev(div7, t23);
    			append_dev(div10, t24);
    			append_dev(div10, div9);
    			mount_component(thinggrid, div9, null);
    			insert_dev(target, t25, anchor);
    			mount_component(floatwindow, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[25]),
    					listen_dev(button0, "click", /*handleClick_remove*/ ctx[16], false, false, false),
    					listen_dev(button1, "click", /*handleClick_add*/ ctx[17], false, false, false),
    					listen_dev(button2, "click", /*handleClick_fetch*/ ctx[23], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[26]),
    					listen_dev(input1, "keypress", /*handle_keyDown*/ ctx[21], false, false, false),
    					listen_dev(button3, "click", /*handleClick_first*/ ctx[19], false, false, false),
    					listen_dev(input2, "change", /*input2_change_input_handler*/ ctx[27]),
    					listen_dev(input2, "input", /*input2_change_input_handler*/ ctx[27]),
    					listen_dev(input2, "change", /*handle_index_changed*/ ctx[18], false, false, false),
    					listen_dev(button4, "click", /*handleClick_last*/ ctx[20], false, false, false),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[28]),
    					listen_dev(input3, "change", /*handle_index_changed*/ ctx[18], false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[29]),
    					listen_dev(select, "change", /*handle_order_change*/ ctx[22], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*box_delta*/ 4096 && to_number(input0.value) !== /*box_delta*/ ctx[12]) {
    				set_input_value(input0, /*box_delta*/ ctx[12]);
    			}

    			if (dirty[0] & /*search_topic*/ 16 && input1.value !== /*search_topic*/ ctx[4]) {
    				set_input_value(input1, /*search_topic*/ ctx[4]);
    			}

    			if (!current || dirty[0] & /*article_count*/ 1024) {
    				attr_dev(input2, "max", /*article_count*/ ctx[10]);
    			}

    			if (dirty[0] & /*article_index*/ 2048) {
    				set_input_value(input2, /*article_index*/ ctx[11]);
    			}

    			if (!current || dirty[0] & /*article_count*/ 1024) {
    				attr_dev(input3, "max", /*article_count*/ ctx[10]);
    			}

    			if (dirty[0] & /*article_index*/ 2048 && to_number(input3.value) !== /*article_index*/ ctx[11]) {
    				set_input_value(input3, /*article_index*/ ctx[11]);
    			}

    			if (!current || dirty[0] & /*article_count*/ 1024) set_data_dev(t17, /*article_count*/ ctx[10]);

    			if (dirty[0] & /*qlist_ordering*/ 8192) {
    				each_value = /*qlist_ordering*/ ctx[13];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*search_ordering, qlist_ordering*/ 8200) {
    				select_option(select, /*search_ordering*/ ctx[3]);
    			}

    			if (!current || dirty[0] & /*current_roller_title*/ 32) set_data_dev(t21, /*current_roller_title*/ ctx[5]);
    			if (!current || dirty[0] & /*current_roller_subject*/ 64) set_data_dev(t23, /*current_roller_subject*/ ctx[6]);
    			const thinggrid_changes = {};
    			if (dirty[0] & /*things*/ 512) thinggrid_changes.things = /*things*/ ctx[9];
    			thinggrid.$set(thinggrid_changes);
    			const floatwindow_changes = {};
    			if (dirty[0] & /*current_thing*/ 128) floatwindow_changes.title = /*current_thing*/ ctx[7].title.substr(0, /*g_max_title_chars*/ ctx[14]) + "...";
    			if (dirty[0] & /*window_scale*/ 256) floatwindow_changes.scale_size = /*window_scale*/ ctx[8];

    			if (dirty[0] & /*current_thing, items, component_graphs, cols*/ 135 | dirty[1] & /*$$scope*/ 1048576) {
    				floatwindow_changes.$$scope = { dirty, ctx };
    			}

    			floatwindow.$set(floatwindow_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(thinggrid.$$.fragment, local);
    			transition_in(floatwindow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(thinggrid.$$.fragment, local);
    			transition_out(floatwindow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			destroy_each(each_blocks, detaching);
    			destroy_component(thinggrid);
    			if (detaching) detach_dev(t25);
    			destroy_component(floatwindow, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const COLS = 16;
    const data_stem = "load_demos";

    function popup_size() {
    	let smallest_w = 200; // smallest and bigget willing to accomodate
    	let biggest_w = 3000;
    	let smallest_h = 600;
    	let biggest_h = 1000;

    	// bounded window width
    	let w = Math.max(smallest_w, window.innerWidth);

    	w = Math.min(biggest_w, w);

    	// bounded window height
    	let h = Math.max(smallest_h, window.innerHeight);

    	h = Math.min(biggest_h, h);
    	let p_range;
    	let P;

    	//	percentage h range 
    	let h_p_max = 0.96;

    	let h_p_min = 0.75;
    	p_range = h_p_max - h_p_min;
    	P = (biggest_h - h) / (biggest_h - smallest_h);
    	console.log("P h: " + P);
    	let h_scale = P * p_range + h_p_min;

    	//	percentage w range 
    	let w_p_max = 0.96;

    	let w_p_min = 0.2;
    	p_range = w_p_max - w_p_min;
    	P = (biggest_w - w) / (biggest_w - smallest_w);
    	console.log("P w: " + P);
    	let w_scale = P * p_range + w_p_min;

    	// Setting the current height & width 
    	// to the elements 
    	return { "w": w_scale, "h": h_scale };
    }

    function clonify(obj) {
    	let o = JSON.parse(JSON.stringify(obj));
    	return o;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let { name } = $$props;

    	// TEST LAYOUT TEST TEST TEST
    	const id = () => "_" + Math.random().toString(36).substr(2, 9);

    	const randomHexColorCode = () => {
    		let n = (Math.random() * 1048575 * 1000000).toString(16);
    		return "#" + n.slice(0, 6);
    	};

    	function generateLayout(col, howmany) {
    		return new Array(howmany).fill(null).map((item, i) => {
    			const y = Math.ceil(Math.random() * 4) + 1;

    			return {
    				16: gridHelp.item({
    					x: i * 2 % col,
    					y: Math.floor(i / 6) * y,
    					w: 2,
    					h: y
    				}),
    				id: id(),
    				data: randomHexColorCode()
    			};
    		});
    	}

    	let itemsA = [
    		{
    			[COLS]: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }),
    			id: id()
    		},
    		{
    			[COLS]: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }),
    			id: id()
    		},
    		{
    			[COLS]: gridHelp.item({ x: 4, y: 0, w: 5, h: 2, fixed: true }),
    			id: id()
    		}
    	];

    	let cols;
    	let cols1 = [[1287, 16]];
    	let cols2 = [[1100, 16]];
    	let items = [];
    	let items1 = gridHelp.adjust(generateLayout(16, 20), 16);
    	let items2 = gridHelp.adjust(generateLayout(4, 5), 16);
    	items = items1;
    	cols = cols1;

    	//
    	let one_not_two = true;

    	// END TEST LAYOUT TEST TEST TEST
    	let component_graphs = [];

    	function handle_item_change(athing) {
    		console.log(athing);
    		$$invalidate(1, items = athing.components.boxes); //  one_not_two ? items1 : itemsA;
    		$$invalidate(0, cols = one_not_two ? cols1 : cols2);
    		one_not_two = !one_not_two;
    		$$invalidate(2, component_graphs = athing.components.graphic);

    		$$invalidate(2, component_graphs = component_graphs.map(graphic => {
    			return decodeURIComponent(graphic);
    		}));
    	}

    	let qlist_ordering = [
    		{ id: 1, text: `update_date` },
    		{ id: 2, text: `score` },
    		{ id: 3, text: `create_date` }
    	];

    	let search_ordering = qlist_ordering[2];
    	let search_topic = "any";
    	let g_max_title_chars = 20;
    	let current_roller_title = "";
    	let current_roller_subject = "";

    	let current_thing = {
    		"id": 0,
    		"color": "grey",
    		"entry": 0,
    		"business_id": "no content",
    		"title": "",
    		"dates": { "created": "never", "updated": "never" },
    		"subject": "",
    		"keys": [],
    		"t_type": "",
    		"txt_full": "",
    		"score": 1,
    		"components": { "graphic": [], "boxes": [] }
    	};

    	let window_scale = { "w": 0.4, "h": 0.8 };

    	//
    	window_scale = popup_size();

    	//
    	onMount(() => {
    		window.addEventListener("resize", e => {
    			//
    			let scale = popup_size();

    			//
    			$$invalidate(8, window_scale.h = scale.h, window_scale);

    			$$invalidate(8, window_scale.w = scale.w, window_scale);
    		}); //
    	});

    	function handleMessage(event) {
    		let key = "xy_";
    		let txt = event.detail.text;
    		let idx = txt.substr(txt.indexOf(key) + 3);
    		let etype = event.detail.type;
    		idx = parseInt(idx);
    		idx--;

    		if (idx !== undefined && idx >= 0 && idx < things.length) {
    			let athing = things[idx];

    			if (athing !== undefined) {
    				if (etype === "click") {
    					// change the grid for the app
    					handle_item_change(athing);

    					$$invalidate(7, current_thing = athing);
    					start_floating_window();
    				} else {
    					$$invalidate(5, current_roller_title = athing.title);
    					$$invalidate(6, current_roller_subject = athing.subject);
    				}
    			}
    		}
    	}

    	let app_empty_object = {
    		"id": 1,
    		"color": "grey",
    		"entry": -1,
    		"business_id": "",
    		"title": "",
    		"dates": { "created": "never", "updated": "never" },
    		"subject": "",
    		"keys": [],
    		"t_type": "",
    		"txt_full": "",
    		"score": 1,
    		"components": { "graphic": [], "boxes": [] }
    	};

    	let things = [
    		// window
    		app_empty_object
    	];

    	let other_things = []; // current data...		loaded from server 
    	let article_count = 1;
    	let article_index = 1;
    	let box_delta = 1; // how boxes to add when increasing the window

    	function padd_other_things(count) {
    		let n = count - other_things.length;

    		while (n > 0) {
    			other_things.push(false);
    			n--;
    		}
    	}

    	function needs_data(start, end) {
    		if (other_things.length > 0) {
    			for (let i = start; i < end; i++) {
    				if (other_things[i] === false) {
    					return true;
    				}
    			}
    		}

    		return false;
    	}

    	function do_data_placement() {
    		let end = article_index + things.length;
    		let start = article_index - 1;

    		if (needs_data(start, end)) {
    			load_and_place_data(start, things.length);
    		} else {
    			place_data();
    		}
    	}

    	function handleClick_remove() {
    		for (let i = 0; i < box_delta; i++) {
    			let p = things;
    			p.pop();
    			$$invalidate(9, things = [...p]);
    		}
    	}

    	async function handleClick_add() {
    		let start = things.length;

    		for (let i = 0; i < box_delta; i++) {
    			let thing_counter = things.length;
    			thing_counter++;

    			$$invalidate(9, things = [
    				...things,
    				{
    					"id": thing_counter,
    					"color": "grey",
    					"business_id": "",
    					"title": "",
    					"dates": { "created": "never", "updated": "never" },
    					"subject": "",
    					"keys": [],
    					"t_type": "",
    					"txt_full": "",
    					"score": 1,
    					"components": { "graphic": [], "boxes": [] }
    				}
    			]);
    		}

    		//
    		let end = things.length; /// start + box_delta

    		if (needs_data(start, end)) {
    			load_and_place_data(start, things.length);
    		} else {
    			place_data();
    		}
    	} //

    	function place_data(dstart) {
    		let l = things.length;
    		let lo = other_things.length;

    		//
    		let strt = dstart === undefined ? article_index - 1 : dstart - 1;

    		//
    		console.log(`place_data: ${strt}  ${lo}`);

    		for (let i = 0; i < l; i++) {
    			if (strt + i < lo) {
    				let oto = other_things[strt + i];

    				if (oto !== false) {
    					oto.id = i + 1;
    					$$invalidate(9, things[i] = oto, things);
    				} else {
    					let ceo = clonify(app_empty_object);
    					ceo.id = i + 1;
    					$$invalidate(9, things[i] = ceo, things);
    				}
    			} else {
    				let ceo = clonify(app_empty_object);
    				ceo.id = i + 1;
    				$$invalidate(9, things[i] = ceo, things);
    			}
    		}
    	}

    	function handle_index_changed() {
    		do_data_placement();
    	}

    	function handleClick_first() {
    		$$invalidate(11, article_index = 1);
    		do_data_placement();
    	}

    	function handleClick_last() {
    		$$invalidate(11, article_index = article_count);
    		do_data_placement();
    	}

    	function handle_keyDown(ev) {
    		if (ev.charCode == 13) {
    			$$invalidate(11, article_index = 1);
    			data_fetcher();
    		}
    	}

    	function handle_order_change(ev) {
    		$$invalidate(11, article_index = 1);
    		data_fetcher();
    	}

    	function load_and_place_data(start, how_many) {
    		data_fetcher(null, start, how_many);
    	}

    	function handleClick_fetch(ev) {
    		$$invalidate(11, article_index = 1);
    		data_fetcher();
    	}

    	async function data_fetcher(ev, qstart, alt_length) {
    		let l = alt_length === undefined ? things.length : alt_length;
    		let stindex = qstart === undefined ? article_index - 1 : qstart;
    		let qry = encodeURIComponent(search_topic);
    		qry += "|" + search_ordering.text;

    		//
    		//console.log(search_ordering.text)
    		//
    		let uid = get_search(qry, true);

    		//
    		stindex = Math.max(0, stindex);

    		let post_data = {
    			uid,
    			"query": qry,
    			"box_count": l,
    			"offset": stindex
    		};

    		try {
    			let rest = `${post_data.uid}/${post_data.query}/${post_data.box_count}/${post_data.offset}`;
    			let srver = location.host;
    			let prot = location.protocol;
    			let sp = "//";
    			let search_result = await postData(`${prot}${sp}${srver}/${data_stem}/${rest}`, post_data);

    			if (search_result) {
    				let data = search_result.data;

    				if (data) {
    					//
    					data = data.map(datum => {
    						datum.subject = decodeURIComponent(datum.subject);
    						datum.title = decodeURIComponent(datum.subject);
    						datum.txt_full = decodeURIComponent(datum.txt_full);

    						datum.keys = datum.keys.map(key => {
    							return decodeURIComponent(key);
    						});

    						return datum;
    					});

    					if (qstart === undefined) {
    						// used the search button
    						other_things = data; // replace data

    						$$invalidate(11, article_index = 1);
    						let lo = search_result.count;
    						$$invalidate(10, article_count = lo);

    						if (lo > other_things.length) {
    							padd_other_things(lo);
    						}
    					} else {
    						let lo = search_result.count;
    						$$invalidate(10, article_count = lo);

    						if (lo > other_things.length) {
    							padd_other_things(lo);
    						}

    						let n = data.length;

    						for (let i = 0; i < n; i++) {
    							other_things[i + stindex] = data.shift();
    						}
    					} // // 

    					place_data();
    				}
    			}
    		} catch(e) {
    			alert(e.message);
    		}
    	}

    	const writable_props = ["name"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		box_delta = to_number(this.value);
    		$$invalidate(12, box_delta);
    	}

    	function input1_input_handler() {
    		search_topic = this.value;
    		$$invalidate(4, search_topic);
    	}

    	function input2_change_input_handler() {
    		article_index = to_number(this.value);
    		$$invalidate(11, article_index);
    	}

    	function input3_input_handler() {
    		article_index = to_number(this.value);
    		$$invalidate(11, article_index);
    	}

    	function select_change_handler() {
    		search_ordering = select_value(this);
    		$$invalidate(3, search_ordering);
    		$$invalidate(13, qlist_ordering);
    	}

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(24, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		name,
    		ThingGrid,
    		FloatWindow,
    		TopicMessages,
    		gridHelp,
    		onMount,
    		get_search,
    		id,
    		randomHexColorCode,
    		generateLayout,
    		COLS,
    		itemsA,
    		cols,
    		cols1,
    		cols2,
    		items,
    		items1,
    		items2,
    		one_not_two,
    		component_graphs,
    		handle_item_change,
    		qlist_ordering,
    		search_ordering,
    		search_topic,
    		g_max_title_chars,
    		data_stem,
    		current_roller_title,
    		current_roller_subject,
    		current_thing,
    		window_scale,
    		popup_size,
    		handleMessage,
    		app_empty_object,
    		things,
    		other_things,
    		article_count,
    		article_index,
    		box_delta,
    		padd_other_things,
    		needs_data,
    		do_data_placement,
    		handleClick_remove,
    		handleClick_add,
    		clonify,
    		place_data,
    		handle_index_changed,
    		handleClick_first,
    		handleClick_last,
    		handle_keyDown,
    		handle_order_change,
    		load_and_place_data,
    		handleClick_fetch,
    		data_fetcher
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(24, name = $$props.name);
    		if ("itemsA" in $$props) itemsA = $$props.itemsA;
    		if ("cols" in $$props) $$invalidate(0, cols = $$props.cols);
    		if ("cols1" in $$props) cols1 = $$props.cols1;
    		if ("cols2" in $$props) cols2 = $$props.cols2;
    		if ("items" in $$props) $$invalidate(1, items = $$props.items);
    		if ("items1" in $$props) items1 = $$props.items1;
    		if ("items2" in $$props) items2 = $$props.items2;
    		if ("one_not_two" in $$props) one_not_two = $$props.one_not_two;
    		if ("component_graphs" in $$props) $$invalidate(2, component_graphs = $$props.component_graphs);
    		if ("qlist_ordering" in $$props) $$invalidate(13, qlist_ordering = $$props.qlist_ordering);
    		if ("search_ordering" in $$props) $$invalidate(3, search_ordering = $$props.search_ordering);
    		if ("search_topic" in $$props) $$invalidate(4, search_topic = $$props.search_topic);
    		if ("g_max_title_chars" in $$props) $$invalidate(14, g_max_title_chars = $$props.g_max_title_chars);
    		if ("current_roller_title" in $$props) $$invalidate(5, current_roller_title = $$props.current_roller_title);
    		if ("current_roller_subject" in $$props) $$invalidate(6, current_roller_subject = $$props.current_roller_subject);
    		if ("current_thing" in $$props) $$invalidate(7, current_thing = $$props.current_thing);
    		if ("window_scale" in $$props) $$invalidate(8, window_scale = $$props.window_scale);
    		if ("app_empty_object" in $$props) app_empty_object = $$props.app_empty_object;
    		if ("things" in $$props) $$invalidate(9, things = $$props.things);
    		if ("other_things" in $$props) other_things = $$props.other_things;
    		if ("article_count" in $$props) $$invalidate(10, article_count = $$props.article_count);
    		if ("article_index" in $$props) $$invalidate(11, article_index = $$props.article_index);
    		if ("box_delta" in $$props) $$invalidate(12, box_delta = $$props.box_delta);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		cols,
    		items,
    		component_graphs,
    		search_ordering,
    		search_topic,
    		current_roller_title,
    		current_roller_subject,
    		current_thing,
    		window_scale,
    		things,
    		article_count,
    		article_index,
    		box_delta,
    		qlist_ordering,
    		g_max_title_chars,
    		handleMessage,
    		handleClick_remove,
    		handleClick_add,
    		handle_index_changed,
    		handleClick_first,
    		handleClick_last,
    		handle_keyDown,
    		handle_order_change,
    		handleClick_fetch,
    		name,
    		input0_input_handler,
    		input1_input_handler,
    		input2_change_input_handler,
    		input3_input_handler,
    		select_change_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 24 }, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[24] === undefined && !("name" in props)) {
    			console_1.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.getElementById('app-main'),
    	props: {
    		name: 'My Blog With Grid'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map

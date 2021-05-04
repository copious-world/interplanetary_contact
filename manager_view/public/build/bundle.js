
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
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
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
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
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
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
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
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
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
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
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

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCFoundation = /** @class */ (function () {
        function MDCFoundation(adapter) {
            if (adapter === void 0) { adapter = {}; }
            this.adapter = adapter;
        }
        Object.defineProperty(MDCFoundation, "cssClasses", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports every
                // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "strings", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "numbers", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "defaultAdapter", {
            get: function () {
                // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
                // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
                // validation.
                return {};
            },
            enumerable: false,
            configurable: true
        });
        MDCFoundation.prototype.init = function () {
            // Subclasses should override this method to perform initialization routines (registering events, etc.)
        };
        MDCFoundation.prototype.destroy = function () {
            // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
        };
        return MDCFoundation;
    }());

    /**
     * @license
     * Copyright 2019 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * Determine whether the current browser supports passive event listeners, and
     * if so, use them.
     */
    function applyPassive$1(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        return supportsPassiveOption(globalObj) ?
            { passive: true } :
            false;
    }
    function supportsPassiveOption(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        // See
        // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        var passiveSupported = false;
        try {
            var options = {
                // This function will be called when the browser
                // attempts to access the passive property.
                get passive() {
                    passiveSupported = true;
                    return false;
                }
            };
            var handler = function () { };
            globalObj.document.addEventListener('test', handler, options);
            globalObj.document.removeEventListener('test', handler, options);
        }
        catch (err) {
            passiveSupported = false;
        }
        return passiveSupported;
    }

    var events = /*#__PURE__*/Object.freeze({
        __proto__: null,
        applyPassive: applyPassive$1
    });

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * @fileoverview A "ponyfill" is a polyfill that doesn't modify the global prototype chain.
     * This makes ponyfills safer than traditional polyfills, especially for libraries like MDC.
     */
    function closest(element, selector) {
        if (element.closest) {
            return element.closest(selector);
        }
        var el = element;
        while (el) {
            if (matches$1(el, selector)) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }
    function matches$1(element, selector) {
        var nativeMatches = element.matches
            || element.webkitMatchesSelector
            || element.msMatchesSelector;
        return nativeMatches.call(element, selector);
    }
    /**
     * Used to compute the estimated scroll width of elements. When an element is
     * hidden due to display: none; being applied to a parent element, the width is
     * returned as 0. However, the element will have a true width once no longer
     * inside a display: none context. This method computes an estimated width when
     * the element is hidden or returns the true width when the element is visble.
     * @param {Element} element the element whose width to estimate
     */
    function estimateScrollWidth(element) {
        // Check the offsetParent. If the element inherits display: none from any
        // parent, the offsetParent property will be null (see
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent).
        // This check ensures we only clone the node when necessary.
        var htmlEl = element;
        if (htmlEl.offsetParent !== null) {
            return htmlEl.scrollWidth;
        }
        var clone = htmlEl.cloneNode(true);
        clone.style.setProperty('position', 'absolute');
        clone.style.setProperty('transform', 'translate(-9999px, -9999px)');
        document.documentElement.appendChild(clone);
        var scrollWidth = clone.scrollWidth;
        document.documentElement.removeChild(clone);
        return scrollWidth;
    }

    var ponyfill = /*#__PURE__*/Object.freeze({
        __proto__: null,
        closest: closest,
        matches: matches$1,
        estimateScrollWidth: estimateScrollWidth
    });

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$3 = {
        // Ripple is a special case where the "root" component is really a "mixin" of sorts,
        // given that it's an 'upgrade' to an existing component. That being said it is the root
        // CSS class that all other CSS classes derive from.
        BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
        FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
        FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',
        ROOT: 'mdc-ripple-upgraded',
        UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
    };
    var strings$4 = {
        VAR_FG_SCALE: '--mdc-ripple-fg-scale',
        VAR_FG_SIZE: '--mdc-ripple-fg-size',
        VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',
        VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
        VAR_LEFT: '--mdc-ripple-left',
        VAR_TOP: '--mdc-ripple-top',
    };
    var numbers$1 = {
        DEACTIVATION_TIMEOUT_MS: 225,
        FG_DEACTIVATION_MS: 150,
        INITIAL_ORIGIN_SCALE: 0.6,
        PADDING: 10,
        TAP_DELAY_MS: 300, // Delay between touch and simulated mouse events on touch devices
    };

    /**
     * Stores result from supportsCssVariables to avoid redundant processing to
     * detect CSS custom variable support.
     */
    var supportsCssVariables_;
    function supportsCssVariables(windowObj, forceRefresh) {
        if (forceRefresh === void 0) { forceRefresh = false; }
        var CSS = windowObj.CSS;
        var supportsCssVars = supportsCssVariables_;
        if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {
            return supportsCssVariables_;
        }
        var supportsFunctionPresent = CSS && typeof CSS.supports === 'function';
        if (!supportsFunctionPresent) {
            return false;
        }
        var explicitlySupportsCssVars = CSS.supports('--css-vars', 'yes');
        // See: https://bugs.webkit.org/show_bug.cgi?id=154669
        // See: README section on Safari
        var weAreFeatureDetectingSafari10plus = (CSS.supports('(--css-vars: yes)') &&
            CSS.supports('color', '#00000000'));
        supportsCssVars =
            explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus;
        if (!forceRefresh) {
            supportsCssVariables_ = supportsCssVars;
        }
        return supportsCssVars;
    }
    function getNormalizedEventCoords(evt, pageOffset, clientRect) {
        if (!evt) {
            return { x: 0, y: 0 };
        }
        var x = pageOffset.x, y = pageOffset.y;
        var documentX = x + clientRect.left;
        var documentY = y + clientRect.top;
        var normalizedX;
        var normalizedY;
        // Determine touch point relative to the ripple container.
        if (evt.type === 'touchstart') {
            var touchEvent = evt;
            normalizedX = touchEvent.changedTouches[0].pageX - documentX;
            normalizedY = touchEvent.changedTouches[0].pageY - documentY;
        }
        else {
            var mouseEvent = evt;
            normalizedX = mouseEvent.pageX - documentX;
            normalizedY = mouseEvent.pageY - documentY;
        }
        return { x: normalizedX, y: normalizedY };
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    // Activation events registered on the root element of each instance for activation
    var ACTIVATION_EVENT_TYPES = [
        'touchstart', 'pointerdown', 'mousedown', 'keydown',
    ];
    // Deactivation events registered on documentElement when a pointer-related down event occurs
    var POINTER_DEACTIVATION_EVENT_TYPES = [
        'touchend', 'pointerup', 'mouseup', 'contextmenu',
    ];
    // simultaneous nested activations
    var activatedTargets = [];
    var MDCRippleFoundation = /** @class */ (function (_super) {
        __extends(MDCRippleFoundation, _super);
        function MDCRippleFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCRippleFoundation.defaultAdapter), adapter)) || this;
            _this.activationAnimationHasEnded_ = false;
            _this.activationTimer_ = 0;
            _this.fgDeactivationRemovalTimer_ = 0;
            _this.fgScale_ = '0';
            _this.frame_ = { width: 0, height: 0 };
            _this.initialSize_ = 0;
            _this.layoutFrame_ = 0;
            _this.maxRadius_ = 0;
            _this.unboundedCoords_ = { left: 0, top: 0 };
            _this.activationState_ = _this.defaultActivationState_();
            _this.activationTimerCallback_ = function () {
                _this.activationAnimationHasEnded_ = true;
                _this.runDeactivationUXLogicIfReady_();
            };
            _this.activateHandler_ = function (e) { return _this.activate_(e); };
            _this.deactivateHandler_ = function () { return _this.deactivate_(); };
            _this.focusHandler_ = function () { return _this.handleFocus(); };
            _this.blurHandler_ = function () { return _this.handleBlur(); };
            _this.resizeHandler_ = function () { return _this.layout(); };
            return _this;
        }
        Object.defineProperty(MDCRippleFoundation, "cssClasses", {
            get: function () {
                return cssClasses$3;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "strings", {
            get: function () {
                return strings$4;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "numbers", {
            get: function () {
                return numbers$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "defaultAdapter", {
            get: function () {
                return {
                    addClass: function () { return undefined; },
                    browserSupportsCssVars: function () { return true; },
                    computeBoundingRect: function () { return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }); },
                    containsEventTarget: function () { return true; },
                    deregisterDocumentInteractionHandler: function () { return undefined; },
                    deregisterInteractionHandler: function () { return undefined; },
                    deregisterResizeHandler: function () { return undefined; },
                    getWindowPageOffset: function () { return ({ x: 0, y: 0 }); },
                    isSurfaceActive: function () { return true; },
                    isSurfaceDisabled: function () { return true; },
                    isUnbounded: function () { return true; },
                    registerDocumentInteractionHandler: function () { return undefined; },
                    registerInteractionHandler: function () { return undefined; },
                    registerResizeHandler: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    updateCssVariable: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCRippleFoundation.prototype.init = function () {
            var _this = this;
            var supportsPressRipple = this.supportsPressRipple_();
            this.registerRootHandlers_(supportsPressRipple);
            if (supportsPressRipple) {
                var _a = MDCRippleFoundation.cssClasses, ROOT_1 = _a.ROOT, UNBOUNDED_1 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.addClass(ROOT_1);
                    if (_this.adapter.isUnbounded()) {
                        _this.adapter.addClass(UNBOUNDED_1);
                        // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
                        _this.layoutInternal_();
                    }
                });
            }
        };
        MDCRippleFoundation.prototype.destroy = function () {
            var _this = this;
            if (this.supportsPressRipple_()) {
                if (this.activationTimer_) {
                    clearTimeout(this.activationTimer_);
                    this.activationTimer_ = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_ACTIVATION);
                }
                if (this.fgDeactivationRemovalTimer_) {
                    clearTimeout(this.fgDeactivationRemovalTimer_);
                    this.fgDeactivationRemovalTimer_ = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_DEACTIVATION);
                }
                var _a = MDCRippleFoundation.cssClasses, ROOT_2 = _a.ROOT, UNBOUNDED_2 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.removeClass(ROOT_2);
                    _this.adapter.removeClass(UNBOUNDED_2);
                    _this.removeCssVars_();
                });
            }
            this.deregisterRootHandlers_();
            this.deregisterDeactivationHandlers_();
        };
        /**
         * @param evt Optional event containing position information.
         */
        MDCRippleFoundation.prototype.activate = function (evt) {
            this.activate_(evt);
        };
        MDCRippleFoundation.prototype.deactivate = function () {
            this.deactivate_();
        };
        MDCRippleFoundation.prototype.layout = function () {
            var _this = this;
            if (this.layoutFrame_) {
                cancelAnimationFrame(this.layoutFrame_);
            }
            this.layoutFrame_ = requestAnimationFrame(function () {
                _this.layoutInternal_();
                _this.layoutFrame_ = 0;
            });
        };
        MDCRippleFoundation.prototype.setUnbounded = function (unbounded) {
            var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;
            if (unbounded) {
                this.adapter.addClass(UNBOUNDED);
            }
            else {
                this.adapter.removeClass(UNBOUNDED);
            }
        };
        MDCRippleFoundation.prototype.handleFocus = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        MDCRippleFoundation.prototype.handleBlur = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        /**
         * We compute this property so that we are not querying information about the client
         * until the point in time where the foundation requests it. This prevents scenarios where
         * client-side feature-detection may happen too early, such as when components are rendered on the server
         * and then initialized at mount time on the client.
         */
        MDCRippleFoundation.prototype.supportsPressRipple_ = function () {
            return this.adapter.browserSupportsCssVars();
        };
        MDCRippleFoundation.prototype.defaultActivationState_ = function () {
            return {
                activationEvent: undefined,
                hasDeactivationUXRun: false,
                isActivated: false,
                isProgrammatic: false,
                wasActivatedByPointer: false,
                wasElementMadeActive: false,
            };
        };
        /**
         * supportsPressRipple Passed from init to save a redundant function call
         */
        MDCRippleFoundation.prototype.registerRootHandlers_ = function (supportsPressRipple) {
            var _this = this;
            if (supportsPressRipple) {
                ACTIVATION_EVENT_TYPES.forEach(function (evtType) {
                    _this.adapter.registerInteractionHandler(evtType, _this.activateHandler_);
                });
                if (this.adapter.isUnbounded()) {
                    this.adapter.registerResizeHandler(this.resizeHandler_);
                }
            }
            this.adapter.registerInteractionHandler('focus', this.focusHandler_);
            this.adapter.registerInteractionHandler('blur', this.blurHandler_);
        };
        MDCRippleFoundation.prototype.registerDeactivationHandlers_ = function (evt) {
            var _this = this;
            if (evt.type === 'keydown') {
                this.adapter.registerInteractionHandler('keyup', this.deactivateHandler_);
            }
            else {
                POINTER_DEACTIVATION_EVENT_TYPES.forEach(function (evtType) {
                    _this.adapter.registerDocumentInteractionHandler(evtType, _this.deactivateHandler_);
                });
            }
        };
        MDCRippleFoundation.prototype.deregisterRootHandlers_ = function () {
            var _this = this;
            ACTIVATION_EVENT_TYPES.forEach(function (evtType) {
                _this.adapter.deregisterInteractionHandler(evtType, _this.activateHandler_);
            });
            this.adapter.deregisterInteractionHandler('focus', this.focusHandler_);
            this.adapter.deregisterInteractionHandler('blur', this.blurHandler_);
            if (this.adapter.isUnbounded()) {
                this.adapter.deregisterResizeHandler(this.resizeHandler_);
            }
        };
        MDCRippleFoundation.prototype.deregisterDeactivationHandlers_ = function () {
            var _this = this;
            this.adapter.deregisterInteractionHandler('keyup', this.deactivateHandler_);
            POINTER_DEACTIVATION_EVENT_TYPES.forEach(function (evtType) {
                _this.adapter.deregisterDocumentInteractionHandler(evtType, _this.deactivateHandler_);
            });
        };
        MDCRippleFoundation.prototype.removeCssVars_ = function () {
            var _this = this;
            var rippleStrings = MDCRippleFoundation.strings;
            var keys = Object.keys(rippleStrings);
            keys.forEach(function (key) {
                if (key.indexOf('VAR_') === 0) {
                    _this.adapter.updateCssVariable(rippleStrings[key], null);
                }
            });
        };
        MDCRippleFoundation.prototype.activate_ = function (evt) {
            var _this = this;
            if (this.adapter.isSurfaceDisabled()) {
                return;
            }
            var activationState = this.activationState_;
            if (activationState.isActivated) {
                return;
            }
            // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
            var previousActivationEvent = this.previousActivationEvent_;
            var isSameInteraction = previousActivationEvent && evt !== undefined && previousActivationEvent.type !== evt.type;
            if (isSameInteraction) {
                return;
            }
            activationState.isActivated = true;
            activationState.isProgrammatic = evt === undefined;
            activationState.activationEvent = evt;
            activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== undefined && (evt.type === 'mousedown' || evt.type === 'touchstart' || evt.type === 'pointerdown');
            var hasActivatedChild = evt !== undefined &&
                activatedTargets.length > 0 &&
                activatedTargets.some(function (target) { return _this.adapter.containsEventTarget(target); });
            if (hasActivatedChild) {
                // Immediately reset activation state, while preserving logic that prevents touch follow-on events
                this.resetActivationState_();
                return;
            }
            if (evt !== undefined) {
                activatedTargets.push(evt.target);
                this.registerDeactivationHandlers_(evt);
            }
            activationState.wasElementMadeActive = this.checkElementMadeActive_(evt);
            if (activationState.wasElementMadeActive) {
                this.animateActivation_();
            }
            requestAnimationFrame(function () {
                // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
                activatedTargets = [];
                if (!activationState.wasElementMadeActive
                    && evt !== undefined
                    && (evt.key === ' ' || evt.keyCode === 32)) {
                    // If space was pressed, try again within an rAF call to detect :active, because different UAs report
                    // active states inconsistently when they're called within event handling code:
                    // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
                    // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
                    // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
                    // variable is set within a rAF callback for a submit button interaction (#2241).
                    activationState.wasElementMadeActive = _this.checkElementMadeActive_(evt);
                    if (activationState.wasElementMadeActive) {
                        _this.animateActivation_();
                    }
                }
                if (!activationState.wasElementMadeActive) {
                    // Reset activation state immediately if element was not made active.
                    _this.activationState_ = _this.defaultActivationState_();
                }
            });
        };
        MDCRippleFoundation.prototype.checkElementMadeActive_ = function (evt) {
            return (evt !== undefined && evt.type === 'keydown') ?
                this.adapter.isSurfaceActive() :
                true;
        };
        MDCRippleFoundation.prototype.animateActivation_ = function () {
            var _this = this;
            var _a = MDCRippleFoundation.strings, VAR_FG_TRANSLATE_START = _a.VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END = _a.VAR_FG_TRANSLATE_END;
            var _b = MDCRippleFoundation.cssClasses, FG_DEACTIVATION = _b.FG_DEACTIVATION, FG_ACTIVATION = _b.FG_ACTIVATION;
            var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;
            this.layoutInternal_();
            var translateStart = '';
            var translateEnd = '';
            if (!this.adapter.isUnbounded()) {
                var _c = this.getFgTranslationCoordinates_(), startPoint = _c.startPoint, endPoint = _c.endPoint;
                translateStart = startPoint.x + "px, " + startPoint.y + "px";
                translateEnd = endPoint.x + "px, " + endPoint.y + "px";
            }
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
            // Cancel any ongoing activation/deactivation animations
            clearTimeout(this.activationTimer_);
            clearTimeout(this.fgDeactivationRemovalTimer_);
            this.rmBoundedActivationClasses_();
            this.adapter.removeClass(FG_DEACTIVATION);
            // Force layout in order to re-trigger the animation.
            this.adapter.computeBoundingRect();
            this.adapter.addClass(FG_ACTIVATION);
            this.activationTimer_ = setTimeout(function () { return _this.activationTimerCallback_(); }, DEACTIVATION_TIMEOUT_MS);
        };
        MDCRippleFoundation.prototype.getFgTranslationCoordinates_ = function () {
            var _a = this.activationState_, activationEvent = _a.activationEvent, wasActivatedByPointer = _a.wasActivatedByPointer;
            var startPoint;
            if (wasActivatedByPointer) {
                startPoint = getNormalizedEventCoords(activationEvent, this.adapter.getWindowPageOffset(), this.adapter.computeBoundingRect());
            }
            else {
                startPoint = {
                    x: this.frame_.width / 2,
                    y: this.frame_.height / 2,
                };
            }
            // Center the element around the start point.
            startPoint = {
                x: startPoint.x - (this.initialSize_ / 2),
                y: startPoint.y - (this.initialSize_ / 2),
            };
            var endPoint = {
                x: (this.frame_.width / 2) - (this.initialSize_ / 2),
                y: (this.frame_.height / 2) - (this.initialSize_ / 2),
            };
            return { startPoint: startPoint, endPoint: endPoint };
        };
        MDCRippleFoundation.prototype.runDeactivationUXLogicIfReady_ = function () {
            var _this = this;
            // This method is called both when a pointing device is released, and when the activation animation ends.
            // The deactivation animation should only run after both of those occur.
            var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;
            var _a = this.activationState_, hasDeactivationUXRun = _a.hasDeactivationUXRun, isActivated = _a.isActivated;
            var activationHasEnded = hasDeactivationUXRun || !isActivated;
            if (activationHasEnded && this.activationAnimationHasEnded_) {
                this.rmBoundedActivationClasses_();
                this.adapter.addClass(FG_DEACTIVATION);
                this.fgDeactivationRemovalTimer_ = setTimeout(function () {
                    _this.adapter.removeClass(FG_DEACTIVATION);
                }, numbers$1.FG_DEACTIVATION_MS);
            }
        };
        MDCRippleFoundation.prototype.rmBoundedActivationClasses_ = function () {
            var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;
            this.adapter.removeClass(FG_ACTIVATION);
            this.activationAnimationHasEnded_ = false;
            this.adapter.computeBoundingRect();
        };
        MDCRippleFoundation.prototype.resetActivationState_ = function () {
            var _this = this;
            this.previousActivationEvent_ = this.activationState_.activationEvent;
            this.activationState_ = this.defaultActivationState_();
            // Touch devices may fire additional events for the same interaction within a short time.
            // Store the previous event until it's safe to assume that subsequent events are for new interactions.
            setTimeout(function () { return _this.previousActivationEvent_ = undefined; }, MDCRippleFoundation.numbers.TAP_DELAY_MS);
        };
        MDCRippleFoundation.prototype.deactivate_ = function () {
            var _this = this;
            var activationState = this.activationState_;
            // This can happen in scenarios such as when you have a keyup event that blurs the element.
            if (!activationState.isActivated) {
                return;
            }
            var state = __assign({}, activationState);
            if (activationState.isProgrammatic) {
                requestAnimationFrame(function () { return _this.animateDeactivation_(state); });
                this.resetActivationState_();
            }
            else {
                this.deregisterDeactivationHandlers_();
                requestAnimationFrame(function () {
                    _this.activationState_.hasDeactivationUXRun = true;
                    _this.animateDeactivation_(state);
                    _this.resetActivationState_();
                });
            }
        };
        MDCRippleFoundation.prototype.animateDeactivation_ = function (_a) {
            var wasActivatedByPointer = _a.wasActivatedByPointer, wasElementMadeActive = _a.wasElementMadeActive;
            if (wasActivatedByPointer || wasElementMadeActive) {
                this.runDeactivationUXLogicIfReady_();
            }
        };
        MDCRippleFoundation.prototype.layoutInternal_ = function () {
            var _this = this;
            this.frame_ = this.adapter.computeBoundingRect();
            var maxDim = Math.max(this.frame_.height, this.frame_.width);
            // Surface diameter is treated differently for unbounded vs. bounded ripples.
            // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
            // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
            // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
            // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
            // `overflow: hidden`.
            var getBoundedRadius = function () {
                var hypotenuse = Math.sqrt(Math.pow(_this.frame_.width, 2) + Math.pow(_this.frame_.height, 2));
                return hypotenuse + MDCRippleFoundation.numbers.PADDING;
            };
            this.maxRadius_ = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();
            // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
            var initialSize = Math.floor(maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE);
            // Unbounded ripple size should always be even number to equally center align.
            if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
                this.initialSize_ = initialSize - 1;
            }
            else {
                this.initialSize_ = initialSize;
            }
            this.fgScale_ = "" + this.maxRadius_ / this.initialSize_;
            this.updateLayoutCssVars_();
        };
        MDCRippleFoundation.prototype.updateLayoutCssVars_ = function () {
            var _a = MDCRippleFoundation.strings, VAR_FG_SIZE = _a.VAR_FG_SIZE, VAR_LEFT = _a.VAR_LEFT, VAR_TOP = _a.VAR_TOP, VAR_FG_SCALE = _a.VAR_FG_SCALE;
            this.adapter.updateCssVariable(VAR_FG_SIZE, this.initialSize_ + "px");
            this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale_);
            if (this.adapter.isUnbounded()) {
                this.unboundedCoords_ = {
                    left: Math.round((this.frame_.width / 2) - (this.initialSize_ / 2)),
                    top: Math.round((this.frame_.height / 2) - (this.initialSize_ / 2)),
                };
                this.adapter.updateCssVariable(VAR_LEFT, this.unboundedCoords_.left + "px");
                this.adapter.updateCssVariable(VAR_TOP, this.unboundedCoords_.top + "px");
            }
        };
        return MDCRippleFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$2 = {
        ACTIVE: 'mdc-tab-indicator--active',
        FADE: 'mdc-tab-indicator--fade',
        NO_TRANSITION: 'mdc-tab-indicator--no-transition',
    };
    var strings$3 = {
        CONTENT_SELECTOR: '.mdc-tab-indicator__content',
    };

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabIndicatorFoundation = /** @class */ (function (_super) {
        __extends(MDCTabIndicatorFoundation, _super);
        function MDCTabIndicatorFoundation(adapter) {
            return _super.call(this, __assign(__assign({}, MDCTabIndicatorFoundation.defaultAdapter), adapter)) || this;
        }
        Object.defineProperty(MDCTabIndicatorFoundation, "cssClasses", {
            get: function () {
                return cssClasses$2;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabIndicatorFoundation, "strings", {
            get: function () {
                return strings$3;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabIndicatorFoundation, "defaultAdapter", {
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    computeContentClientRect: function () { return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }); },
                    setContentStyleProperty: function () { return undefined; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        MDCTabIndicatorFoundation.prototype.computeContentClientRect = function () {
            return this.adapter.computeContentClientRect();
        };
        return MDCTabIndicatorFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /* istanbul ignore next: subclass is not a branch statement */
    var MDCFadingTabIndicatorFoundation = /** @class */ (function (_super) {
        __extends(MDCFadingTabIndicatorFoundation, _super);
        function MDCFadingTabIndicatorFoundation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MDCFadingTabIndicatorFoundation.prototype.activate = function () {
            this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
        };
        MDCFadingTabIndicatorFoundation.prototype.deactivate = function () {
            this.adapter.removeClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
        };
        return MDCFadingTabIndicatorFoundation;
    }(MDCTabIndicatorFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /* istanbul ignore next: subclass is not a branch statement */
    var MDCSlidingTabIndicatorFoundation = /** @class */ (function (_super) {
        __extends(MDCSlidingTabIndicatorFoundation, _super);
        function MDCSlidingTabIndicatorFoundation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MDCSlidingTabIndicatorFoundation.prototype.activate = function (previousIndicatorClientRect) {
            // Early exit if no indicator is present to handle cases where an indicator
            // may be activated without a prior indicator state
            if (!previousIndicatorClientRect) {
                this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
                return;
            }
            // This animation uses the FLIP approach. You can read more about it at the link below:
            // https://aerotwist.com/blog/flip-your-animations/
            // Calculate the dimensions based on the dimensions of the previous indicator
            var currentClientRect = this.computeContentClientRect();
            var widthDelta = previousIndicatorClientRect.width / currentClientRect.width;
            var xPosition = previousIndicatorClientRect.left - currentClientRect.left;
            this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.NO_TRANSITION);
            this.adapter.setContentStyleProperty('transform', "translateX(" + xPosition + "px) scaleX(" + widthDelta + ")");
            // Force repaint before updating classes and transform to ensure the transform properly takes effect
            this.computeContentClientRect();
            this.adapter.removeClass(MDCTabIndicatorFoundation.cssClasses.NO_TRANSITION);
            this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
            this.adapter.setContentStyleProperty('transform', '');
        };
        MDCSlidingTabIndicatorFoundation.prototype.deactivate = function () {
            this.adapter.removeClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
        };
        return MDCSlidingTabIndicatorFoundation;
    }(MDCTabIndicatorFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$1 = {
        ACTIVE: 'mdc-tab--active',
    };
    var strings$2 = {
        ARIA_SELECTED: 'aria-selected',
        CONTENT_SELECTOR: '.mdc-tab__content',
        INTERACTED_EVENT: 'MDCTab:interacted',
        RIPPLE_SELECTOR: '.mdc-tab__ripple',
        TABINDEX: 'tabIndex',
        TAB_INDICATOR_SELECTOR: '.mdc-tab-indicator',
    };

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabFoundation = /** @class */ (function (_super) {
        __extends(MDCTabFoundation, _super);
        function MDCTabFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCTabFoundation.defaultAdapter), adapter)) || this;
            _this.focusOnActivate_ = true;
            return _this;
        }
        Object.defineProperty(MDCTabFoundation, "cssClasses", {
            get: function () {
                return cssClasses$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabFoundation, "strings", {
            get: function () {
                return strings$2;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabFoundation, "defaultAdapter", {
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    hasClass: function () { return false; },
                    setAttr: function () { return undefined; },
                    activateIndicator: function () { return undefined; },
                    deactivateIndicator: function () { return undefined; },
                    notifyInteracted: function () { return undefined; },
                    getOffsetLeft: function () { return 0; },
                    getOffsetWidth: function () { return 0; },
                    getContentOffsetLeft: function () { return 0; },
                    getContentOffsetWidth: function () { return 0; },
                    focus: function () { return undefined; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        MDCTabFoundation.prototype.handleClick = function () {
            // It's up to the parent component to keep track of the active Tab and
            // ensure we don't activate a Tab that's already active.
            this.adapter.notifyInteracted();
        };
        MDCTabFoundation.prototype.isActive = function () {
            return this.adapter.hasClass(cssClasses$1.ACTIVE);
        };
        /**
         * Sets whether the tab should focus itself when activated
         */
        MDCTabFoundation.prototype.setFocusOnActivate = function (focusOnActivate) {
            this.focusOnActivate_ = focusOnActivate;
        };
        /**
         * Activates the Tab
         */
        MDCTabFoundation.prototype.activate = function (previousIndicatorClientRect) {
            this.adapter.addClass(cssClasses$1.ACTIVE);
            this.adapter.setAttr(strings$2.ARIA_SELECTED, 'true');
            this.adapter.setAttr(strings$2.TABINDEX, '0');
            this.adapter.activateIndicator(previousIndicatorClientRect);
            if (this.focusOnActivate_) {
                this.adapter.focus();
            }
        };
        /**
         * Deactivates the Tab
         */
        MDCTabFoundation.prototype.deactivate = function () {
            // Early exit
            if (!this.isActive()) {
                return;
            }
            this.adapter.removeClass(cssClasses$1.ACTIVE);
            this.adapter.setAttr(strings$2.ARIA_SELECTED, 'false');
            this.adapter.setAttr(strings$2.TABINDEX, '-1');
            this.adapter.deactivateIndicator();
        };
        /**
         * Returns the dimensions of the Tab
         */
        MDCTabFoundation.prototype.computeDimensions = function () {
            var rootWidth = this.adapter.getOffsetWidth();
            var rootLeft = this.adapter.getOffsetLeft();
            var contentWidth = this.adapter.getContentOffsetWidth();
            var contentLeft = this.adapter.getContentOffsetLeft();
            return {
                contentLeft: rootLeft + contentLeft,
                contentRight: rootLeft + contentLeft + contentWidth,
                rootLeft: rootLeft,
                rootRight: rootLeft + rootWidth,
            };
        };
        return MDCTabFoundation;
    }(MDCFoundation));

    // Match modifiers on DOM events.
    const oldModifierRegex = /^[a-z]+(?::(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    // Match modifiers on other events.
    const newModifierRegex = /^[^$]+(?:\$(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;

    function forwardEventsBuilder(component) {
      // This is our pseudo $on function. It is defined on component mount.
      let $on;
      // This is a list of events bound before mount.
      let events = [];
      // This is the original component $on function.
      const componentOn = component.$on;

      // And we override the $on function to forward all bound events.
      component.$on = (fullEventType, ...args) => {
        let eventType = fullEventType;
        let destructor = () => {};
        if ($on) {
          // The event was bound programmatically.
          destructor = $on(eventType);
        } else {
          // The event was bound before mount by Svelte.
          events.push(eventType);
        }
        const oldModifierMatch = eventType.match(oldModifierRegex);
        const newModifierMatch = eventType.match(newModifierRegex);
        const modifierMatch = oldModifierMatch || newModifierMatch;

        if (oldModifierMatch && console) {
          console.warn(
            'Event modifiers in SMUI now use "$" instead of ":", so that all events can be bound with modifiers. Please update your event binding: ',
            eventType
          );
        }

        if (modifierMatch) {
          // Remove modifiers from the real event.
          const parts = eventType.split(oldModifierMatch ? ':' : '$');
          eventType = parts[0];
        }

        // Call the original $on function.
        const componentDestructor = componentOn.call(component, eventType, ...args);

        return (...args) => {
          destructor();
          return componentDestructor(...args);
        };
      };

      function forward(e) {
        // Internally bubble the event up from Svelte components.
        bubble(component, e);
      }

      return (node) => {
        const destructors = [];

        // This function is responsible for forwarding all bound events.
        $on = (fullEventType) => {
          let eventType = fullEventType;
          let handler = forward;
          // DOM addEventListener options argument.
          let options = false;
          const oldModifierMatch = eventType.match(oldModifierRegex);
          const newModifierMatch = eventType.match(newModifierRegex);
          const modifierMatch = oldModifierMatch || newModifierMatch;
          if (modifierMatch) {
            // Parse the event modifiers.
            // Supported modifiers:
            // - preventDefault
            // - stopPropagation
            // - passive
            // - nonpassive
            // - capture
            // - once
            const parts = eventType.split(oldModifierMatch ? ':' : '$');
            eventType = parts[0];
            options = Object.fromEntries(parts.slice(1).map((mod) => [mod, true]));
            if (options.nonpassive) {
              options.passive = false;
              delete options.nonpassive;
            }
            if (options.preventDefault) {
              handler = prevent_default(handler);
              delete options.preventDefault;
            }
            if (options.stopPropagation) {
              handler = stop_propagation(handler);
              delete options.stopPropagation;
            }
          }

          const off = listen(node, eventType, handler, options);
          const destructor = () => {
            off();
            const idx = destructors.indexOf(destructor);
            if (idx > -1) {
              destructors.splice(idx, 1);
            }
          };

          destructors.push(destructor);
          return destructor;
        };

        for (let i = 0; i < events.length; i++) {
          // Listen to all the events added before mount.
          $on(events[i]);
        }

        return {
          destroy: () => {
            // Remove all event listeners.
            for (let i = 0; i < destructors.length; i++) {
              destructors[i]();
            }
          },
        };
      };
    }

    function classMap(classObj) {
      return Object.entries(classObj)
        .filter(([name, value]) => name !== '' && value)
        .map(([name]) => name)
        .join(' ');
    }

    function dispatch(
      element,
      eventType,
      detail = {},
      eventInit = { bubbles: true }
    ) {
      if (typeof Event !== 'undefined' && element) {
        const event = new Event(eventType, eventInit);
        event.detail = detail;
        const el = 'getElement' in element ? element.getElement() : element;
        el.dispatchEvent(event);
        return event;
      }
    }

    function exclude(obj, keys) {
      let names = Object.getOwnPropertyNames(obj);
      const newObj = {};

      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const cashIndex = name.indexOf('$');
        if (
          cashIndex !== -1 &&
          keys.indexOf(name.substring(0, cashIndex + 1)) !== -1
        ) {
          continue;
        }
        if (keys.indexOf(name) !== -1) {
          continue;
        }
        newObj[name] = obj[name];
      }

      return newObj;
    }

    function prefixFilter(obj, prefix) {
      let names = Object.getOwnPropertyNames(obj);
      const newObj = {};

      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        if (name.substring(0, prefix.length) === prefix) {
          newObj[name.substring(prefix.length)] = obj[name];
        }
      }

      return newObj;
    }

    function useActions(node, actions) {
      let objects = [];

      if (actions) {
        for (let i = 0; i < actions.length; i++) {
          const isArray = Array.isArray(actions[i]);
          const action = isArray ? actions[i][0] : actions[i];
          if (isArray && actions[i].length > 1) {
            objects.push(action(node, actions[i][1]));
          } else {
            objects.push(action(node));
          }
        }
      }

      return {
        update(actions) {
          if (((actions && actions.length) || 0) != objects.length) {
            throw new Error('You must not change the length of an actions array.');
          }

          if (actions) {
            for (let i = 0; i < actions.length; i++) {
              if (objects[i] && 'update' in objects[i]) {
                const isArray = Array.isArray(actions[i]);
                if (isArray && actions[i].length > 1) {
                  objects[i].update(actions[i][1]);
                } else {
                  objects[i].update();
                }
              }
            }
          }
        },

        destroy() {
          for (let i = 0; i < objects.length; i++) {
            if (objects[i] && 'destroy' in objects[i]) {
              objects[i].destroy();
            }
          }
        },
      };
    }

    const { applyPassive } = events;
    const { matches } = ponyfill;

    function Ripple(
      node,
      {
        ripple = true,
        surface = false,
        unbounded = false,
        disabled = false,
        color = null,
        active = null,
        eventTarget = null,
        activeTarget = null,
        addClass = (className) => node.classList.add(className),
        removeClass = (className) => node.classList.remove(className),
        addStyle = (name, value) => node.style.setProperty(name, value),
        initPromise = Promise.resolve(),
      } = {}
    ) {
      let instance;
      let addLayoutListener = getContext('SMUI:addLayoutListener');
      let removeLayoutListener;
      let oldActive = active;
      let oldEventTarget = eventTarget;
      let oldActiveTarget = activeTarget;

      function handleProps() {
        if (surface) {
          addClass('mdc-ripple-surface');
          if (color === 'primary') {
            addClass('smui-ripple-surface--primary');
            removeClass('smui-ripple-surface--secondary');
          } else if (color === 'secondary') {
            removeClass('smui-ripple-surface--primary');
            addClass('smui-ripple-surface--secondary');
          } else {
            removeClass('smui-ripple-surface--primary');
            removeClass('smui-ripple-surface--secondary');
          }
        }

        // Handle activation first.
        if (instance && oldActive !== active) {
          oldActive = active;
          if (active) {
            instance.activate();
          } else if (active === false) {
            instance.deactivate();
          }
        }

        // Then create/destroy an instance.
        if (ripple && !instance) {
          instance = new MDCRippleFoundation({
            addClass,
            browserSupportsCssVars: () => supportsCssVariables(window),
            computeBoundingRect: () => node.getBoundingClientRect(),
            containsEventTarget: (target) => node.contains(target),
            deregisterDocumentInteractionHandler: (evtType, handler) =>
              document.documentElement.removeEventListener(
                evtType,
                handler,
                applyPassive()
              ),
            deregisterInteractionHandler: (evtType, handler) =>
              (eventTarget || node).removeEventListener(
                evtType,
                handler,
                applyPassive()
              ),
            deregisterResizeHandler: (handler) =>
              window.removeEventListener('resize', handler),
            getWindowPageOffset: () => ({
              x: window.pageXOffset,
              y: window.pageYOffset,
            }),
            isSurfaceActive: () =>
              active == null ? matches(activeTarget || node, ':active') : active,
            isSurfaceDisabled: () => !!disabled,
            isUnbounded: () => !!unbounded,
            registerDocumentInteractionHandler: (evtType, handler) =>
              document.documentElement.addEventListener(
                evtType,
                handler,
                applyPassive()
              ),
            registerInteractionHandler: (evtType, handler) =>
              (eventTarget || node).addEventListener(
                evtType,
                handler,
                applyPassive()
              ),
            registerResizeHandler: (handler) =>
              window.addEventListener('resize', handler),
            removeClass,
            updateCssVariable: addStyle,
          });

          initPromise.then(() => {
            instance.init();
            instance.setUnbounded(unbounded);
          });
        } else if (instance && !ripple) {
          initPromise.then(() => {
            instance.destroy();
            instance = null;
          });
        }

        // Now handle event/active targets
        if (
          instance &&
          (oldEventTarget !== eventTarget || oldActiveTarget !== activeTarget)
        ) {
          oldEventTarget = eventTarget;
          oldActiveTarget = activeTarget;

          instance.destroy();
          requestAnimationFrame(() => {
            if (instance) {
              instance.init();
              instance.setUnbounded(unbounded);
            }
          });
        }

        if (!ripple && unbounded) {
          addClass('mdc-ripple-upgraded--unbounded');
        }
      }

      handleProps();

      if (addLayoutListener) {
        removeLayoutListener = addLayoutListener(layout);
      }

      function layout() {
        if (instance) {
          instance.layout();
        }
      }

      return {
        update(props) {
          ({
            ripple,
            surface,
            unbounded,
            disabled,
            color,
            active,
            eventTarget,
            activeTarget,
            addClass,
            removeClass,
            addStyle,
            initPromise,
          } = {
            ripple: true,
            surface: false,
            unbounded: false,
            disabled: false,
            color: null,
            active: null,
            eventTarget: null,
            activeTarget: null,
            addClass: (className) => node.classList.add(className),
            removeClass: (className) => node.classList.remove(className),
            addStyle: (name, value) => node.style.setProperty(name, value),
            initPromise: Promise.resolve(),
            ...props,
          });
          handleProps();
        },

        destroy() {
          if (instance) {
            instance.destroy();
            instance = null;
            removeClass('mdc-ripple-surface');
            removeClass('smui-ripple-surface--primary');
            removeClass('smui-ripple-surface--secondary');
          }

          if (removeLayoutListener) {
            removeLayoutListener();
          }
        },
      };
    }

    /* node_modules/@smui/common/A.svelte generated by Svelte v3.37.0 */
    const file$a = "node_modules/@smui/common/A.svelte";

    function create_fragment$a(ctx) {
    	let a;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*$$restProps*/ ctx[4]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$a, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			/*a_binding*/ ctx[8](a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, a, /*use*/ ctx[1])),
    					action_destroyer(/*forwardEvents*/ ctx[3].call(null, a))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 64) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[6], dirty, null, null);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 2) useActions_action.update.call(null, /*use*/ ctx[1]);
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
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			/*a_binding*/ ctx[8](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	const omit_props_names = ["href","use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("A", slots, ['default']);
    	let { href = "javascript:void(0);" } = $$props;
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element = null;

    	function getElement() {
    		return element;
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("href" in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ("use" in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ("$$scope" in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		href,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
    		if ("use" in $$props) $$invalidate(1, use = $$new_props.use);
    		if ("element" in $$props) $$invalidate(2, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		href,
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		a_binding
    	];
    }

    class A extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$a, safe_not_equal, { href: 0, use: 1, getElement: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "A",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get href() {
    		throw new Error("<A>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get use() {
    		throw new Error("<A>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[5];
    	}

    	set getElement(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/common/Button.svelte generated by Svelte v3.37.0 */
    const file$9 = "node_modules/@smui/common/Button.svelte";

    function create_fragment$9(ctx) {
    	let button;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let button_levels = [/*$$restProps*/ ctx[3]];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			add_location(button, file$9, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			/*button_binding*/ ctx[7](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, button, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[2].call(null, button))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
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
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			/*button_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Button", slots, ['default']);
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element = null;

    	function getElement() {
    		return element;
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("use" in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("use" in $$props) $$invalidate(0, use = $$new_props.use);
    		if ("element" in $$props) $$invalidate(1, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		button_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$9, safe_not_equal, { use: 0, getElement: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get use() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[4];
    	}

    	set getElement(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/tab-indicator/TabIndicator.svelte generated by Svelte v3.37.0 */

    const file$8 = "node_modules/@smui/tab-indicator/TabIndicator.svelte";

    function create_fragment$8(ctx) {
    	let span1;
    	let span0;
    	let span0_class_value;
    	let span0_style_value;
    	let span0_aria_hidden_value;
    	let useActions_action;
    	let span1_class_value;
    	let useActions_action_1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[21].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[20], null);

    	let span0_levels = [
    		{
    			class: span0_class_value = classMap({
    				[/*content$class*/ ctx[6]]: true,
    				"mdc-tab-indicator__content": true,
    				"mdc-tab-indicator__content--underline": /*type*/ ctx[3] === "underline",
    				"mdc-tab-indicator__content--icon": /*type*/ ctx[3] === "icon"
    			})
    		},
    		{
    			style: span0_style_value = Object.entries(/*contentStyles*/ ctx[10]).map(func$2).join(" ")
    		},
    		{
    			"aria-hidden": span0_aria_hidden_value = /*type*/ ctx[3] === "icon" ? "true" : null
    		},
    		prefixFilter(/*$$restProps*/ ctx[12], "content$")
    	];

    	let span0_data = {};

    	for (let i = 0; i < span0_levels.length; i += 1) {
    		span0_data = assign(span0_data, span0_levels[i]);
    	}

    	let span1_levels = [
    		{
    			class: span1_class_value = classMap({
    				[/*className*/ ctx[2]]: true,
    				"mdc-tab-indicator": true,
    				"mdc-tab-indicator--active": /*active*/ ctx[0],
    				"mdc-tab-indicator--fade": /*transition*/ ctx[4] === "fade",
    				.../*internalClasses*/ ctx[9]
    			})
    		},
    		exclude(/*$$restProps*/ ctx[12], ["content$"])
    	];

    	let span1_data = {};

    	for (let i = 0; i < span1_levels.length; i += 1) {
    		span1_data = assign(span1_data, span1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			span0 = element("span");
    			if (default_slot) default_slot.c();
    			set_attributes(span0, span0_data);
    			add_location(span0, file$8, 13, 2, 316);
    			set_attributes(span1, span1_data);
    			add_location(span1, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, span0);

    			if (default_slot) {
    				default_slot.m(span0, null);
    			}

    			/*span0_binding*/ ctx[22](span0);
    			/*span1_binding*/ ctx[23](span1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, span0, /*content$use*/ ctx[5])),
    					action_destroyer(useActions_action_1 = useActions.call(null, span1, /*use*/ ctx[1])),
    					action_destroyer(/*forwardEvents*/ ctx[11].call(null, span1))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1048576) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[20], dirty, null, null);
    				}
    			}

    			set_attributes(span0, span0_data = get_spread_update(span0_levels, [
    				(!current || dirty & /*content$class, type*/ 72 && span0_class_value !== (span0_class_value = classMap({
    					[/*content$class*/ ctx[6]]: true,
    					"mdc-tab-indicator__content": true,
    					"mdc-tab-indicator__content--underline": /*type*/ ctx[3] === "underline",
    					"mdc-tab-indicator__content--icon": /*type*/ ctx[3] === "icon"
    				}))) && { class: span0_class_value },
    				(!current || dirty & /*contentStyles*/ 1024 && span0_style_value !== (span0_style_value = Object.entries(/*contentStyles*/ ctx[10]).map(func$2).join(" "))) && { style: span0_style_value },
    				(!current || dirty & /*type*/ 8 && span0_aria_hidden_value !== (span0_aria_hidden_value = /*type*/ ctx[3] === "icon" ? "true" : null)) && { "aria-hidden": span0_aria_hidden_value },
    				dirty & /*$$restProps*/ 4096 && prefixFilter(/*$$restProps*/ ctx[12], "content$")
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*content$use*/ 32) useActions_action.update.call(null, /*content$use*/ ctx[5]);

    			set_attributes(span1, span1_data = get_spread_update(span1_levels, [
    				(!current || dirty & /*className, active, transition, internalClasses*/ 533 && span1_class_value !== (span1_class_value = classMap({
    					[/*className*/ ctx[2]]: true,
    					"mdc-tab-indicator": true,
    					"mdc-tab-indicator--active": /*active*/ ctx[0],
    					"mdc-tab-indicator--fade": /*transition*/ ctx[4] === "fade",
    					.../*internalClasses*/ ctx[9]
    				}))) && { class: span1_class_value },
    				dirty & /*$$restProps*/ 4096 && exclude(/*$$restProps*/ ctx[12], ["content$"])
    			]));

    			if (useActions_action_1 && is_function(useActions_action_1.update) && dirty & /*use*/ 2) useActions_action_1.update.call(null, /*use*/ ctx[1]);
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
    			if (detaching) detach_dev(span1);
    			if (default_slot) default_slot.d(detaching);
    			/*span0_binding*/ ctx[22](null);
    			/*span1_binding*/ ctx[23](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$2 = ([name, value]) => `${name}: ${value};`;

    function instance_1$3($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","active","type","transition","content$use","content$class","activate","deactivate","computeContentClientRect","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TabIndicator", slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;
    	let { type = "underline" } = $$props;
    	let { transition = "slide" } = $$props;
    	let { content$use = [] } = $$props;
    	let { content$class = "" } = $$props;
    	let element;
    	let instance;
    	let content;
    	let internalClasses = {};
    	let contentStyles = {};
    	let changeSets = [];
    	let oldTransition = transition;

    	onMount(() => {
    		$$invalidate(17, instance = getInstance());
    		instance.init();

    		return () => {
    			instance.destroy();
    		};
    	});

    	function getInstance() {
    		const Foundation = ({
    			fade: MDCFadingTabIndicatorFoundation,
    			slide: MDCSlidingTabIndicatorFoundation
    		})[transition] || MDCSlidingTabIndicatorFoundation;

    		return Foundation
    		? new Foundation({
    					addClass: (...props) => doChange(() => addClass(...props)),
    					removeClass: (...props) => doChange(() => removeClass(...props)),
    					computeContentClientRect,
    					setContentStyleProperty: (...props) => doChange(() => addContentStyle(...props))
    				})
    		: undefined;
    	}

    	function doChange(fn) {
    		if (changeSets.length) {
    			changeSets[changeSets.length - 1].push(fn);
    		} else {
    			fn();
    		}
    	}

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(9, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(9, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addContentStyle(name, value) {
    		if (contentStyles[name] != value) {
    			if (value === "" || value == null) {
    				delete contentStyles[name];
    				((($$invalidate(10, contentStyles), $$invalidate(19, oldTransition)), $$invalidate(4, transition)), $$invalidate(17, instance));
    			} else {
    				$$invalidate(10, contentStyles[name] = value, contentStyles);
    			}
    		}
    	}

    	function activate(previousIndicatorClientRect) {
    		$$invalidate(0, active = true);
    		instance.activate(previousIndicatorClientRect);
    	}

    	function deactivate() {
    		$$invalidate(0, active = false);
    		instance.deactivate();
    	}

    	function computeContentClientRect() {
    		changeSets.push([]);
    		$$invalidate(18, changeSets);
    		return content.getBoundingClientRect();
    	}

    	function getElement() {
    		return element;
    	}

    	function span0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			content = $$value;
    			$$invalidate(8, content);
    		});
    	}

    	function span1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			element = $$value;
    			$$invalidate(7, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("use" in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(0, active = $$new_props.active);
    		if ("type" in $$new_props) $$invalidate(3, type = $$new_props.type);
    		if ("transition" in $$new_props) $$invalidate(4, transition = $$new_props.transition);
    		if ("content$use" in $$new_props) $$invalidate(5, content$use = $$new_props.content$use);
    		if ("content$class" in $$new_props) $$invalidate(6, content$class = $$new_props.content$class);
    		if ("$$scope" in $$new_props) $$invalidate(20, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCFadingTabIndicatorFoundation,
    		MDCSlidingTabIndicatorFoundation,
    		onMount,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		active,
    		type,
    		transition,
    		content$use,
    		content$class,
    		element,
    		instance,
    		content,
    		internalClasses,
    		contentStyles,
    		changeSets,
    		oldTransition,
    		getInstance,
    		doChange,
    		addClass,
    		removeClass,
    		addContentStyle,
    		activate,
    		deactivate,
    		computeContentClientRect,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("use" in $$props) $$invalidate(1, use = $$new_props.use);
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(0, active = $$new_props.active);
    		if ("type" in $$props) $$invalidate(3, type = $$new_props.type);
    		if ("transition" in $$props) $$invalidate(4, transition = $$new_props.transition);
    		if ("content$use" in $$props) $$invalidate(5, content$use = $$new_props.content$use);
    		if ("content$class" in $$props) $$invalidate(6, content$class = $$new_props.content$class);
    		if ("element" in $$props) $$invalidate(7, element = $$new_props.element);
    		if ("instance" in $$props) $$invalidate(17, instance = $$new_props.instance);
    		if ("content" in $$props) $$invalidate(8, content = $$new_props.content);
    		if ("internalClasses" in $$props) $$invalidate(9, internalClasses = $$new_props.internalClasses);
    		if ("contentStyles" in $$props) $$invalidate(10, contentStyles = $$new_props.contentStyles);
    		if ("changeSets" in $$props) $$invalidate(18, changeSets = $$new_props.changeSets);
    		if ("oldTransition" in $$props) $$invalidate(19, oldTransition = $$new_props.oldTransition);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*oldTransition, transition, instance*/ 655376) {
    			if (oldTransition !== transition) {
    				$$invalidate(19, oldTransition = transition);
    				instance && instance.destroy();
    				$$invalidate(9, internalClasses = {});
    				$$invalidate(10, contentStyles = {});
    				$$invalidate(17, instance = getInstance());
    				instance.init();
    			}
    		}

    		if ($$self.$$.dirty & /*changeSets*/ 262144) {
    			// Use sets of changes for DOM updates, to facilitate animations.
    			if (changeSets.length) {
    				requestAnimationFrame(() => {
    					const changeSet = changeSets.shift();
    					$$invalidate(18, changeSets);

    					for (const fn of changeSet) {
    						fn();
    					}
    				});
    			}
    		}
    	};

    	return [
    		active,
    		use,
    		className,
    		type,
    		transition,
    		content$use,
    		content$class,
    		element,
    		content,
    		internalClasses,
    		contentStyles,
    		forwardEvents,
    		$$restProps,
    		activate,
    		deactivate,
    		computeContentClientRect,
    		getElement,
    		instance,
    		changeSets,
    		oldTransition,
    		$$scope,
    		slots,
    		span0_binding,
    		span1_binding
    	];
    }

    class TabIndicator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance_1$3, create_fragment$8, safe_not_equal, {
    			use: 1,
    			class: 2,
    			active: 0,
    			type: 3,
    			transition: 4,
    			content$use: 5,
    			content$class: 6,
    			activate: 13,
    			deactivate: 14,
    			computeContentClientRect: 15,
    			getElement: 16
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabIndicator",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get use() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get content$use() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content$use(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get content$class() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content$class(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activate() {
    		return this.$$.ctx[13];
    	}

    	set activate(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get deactivate() {
    		return this.$$.ctx[14];
    	}

    	set deactivate(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get computeContentClientRect() {
    		return this.$$.ctx[15];
    	}

    	set computeContentClientRect(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[16];
    	}

    	set getElement(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/tab/Tab.svelte generated by Svelte v3.37.0 */

    const { Error: Error_1 } = globals;
    const file$7 = "node_modules/@smui/tab/Tab.svelte";
    const get_tab_indicator_slot_changes_1 = dirty => ({});
    const get_tab_indicator_slot_context_1 = ctx => ({});
    const get_tab_indicator_slot_changes = dirty => ({});
    const get_tab_indicator_slot_context = ctx => ({});

    // (48:4) {#if indicatorSpanOnlyContent}
    function create_if_block_1$1(ctx) {
    	let tabindicator;
    	let current;

    	const tabindicator_spread_levels = [
    		{ active: /*active*/ ctx[18] },
    		prefixFilter(/*$$restProps*/ ctx[24], "tabIndicator$")
    	];

    	let tabindicator_props = {
    		$$slots: { default: [create_default_slot_2$1] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < tabindicator_spread_levels.length; i += 1) {
    		tabindicator_props = assign(tabindicator_props, tabindicator_spread_levels[i]);
    	}

    	tabindicator = new TabIndicator({
    			props: tabindicator_props,
    			$$inline: true
    		});

    	/*tabindicator_binding*/ ctx[31](tabindicator);

    	const block = {
    		c: function create() {
    			create_component(tabindicator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabindicator, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabindicator_changes = (dirty[0] & /*active, $$restProps*/ 17039360)
    			? get_spread_update(tabindicator_spread_levels, [
    					dirty[0] & /*active*/ 262144 && { active: /*active*/ ctx[18] },
    					dirty[0] & /*$$restProps*/ 16777216 && get_spread_object(prefixFilter(/*$$restProps*/ ctx[24], "tabIndicator$"))
    				])
    			: {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				tabindicator_changes.$$scope = { dirty, ctx };
    			}

    			tabindicator.$set(tabindicator_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabindicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabindicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*tabindicator_binding*/ ctx[31](null);
    			destroy_component(tabindicator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(48:4) {#if indicatorSpanOnlyContent}",
    		ctx
    	});

    	return block;
    }

    // (49:6) <TabIndicator         bind:this={tabIndicator}         {active}         {...prefixFilter($$restProps, 'tabIndicator$')}         >
    function create_default_slot_2$1(ctx) {
    	let current;
    	const tab_indicator_slot_template = /*#slots*/ ctx[30]["tab-indicator"];
    	const tab_indicator_slot = create_slot(tab_indicator_slot_template, ctx, /*$$scope*/ ctx[35], get_tab_indicator_slot_context);

    	const block = {
    		c: function create() {
    			if (tab_indicator_slot) tab_indicator_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (tab_indicator_slot) {
    				tab_indicator_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (tab_indicator_slot) {
    				if (tab_indicator_slot.p && dirty[1] & /*$$scope*/ 16) {
    					update_slot(tab_indicator_slot, tab_indicator_slot_template, ctx, /*$$scope*/ ctx[35], dirty, get_tab_indicator_slot_changes, get_tab_indicator_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab_indicator_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab_indicator_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (tab_indicator_slot) tab_indicator_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(49:6) <TabIndicator         bind:this={tabIndicator}         {active}         {...prefixFilter($$restProps, 'tabIndicator$')}         >",
    		ctx
    	});

    	return block;
    }

    // (57:2) {#if !indicatorSpanOnlyContent}
    function create_if_block$3(ctx) {
    	let tabindicator;
    	let current;

    	const tabindicator_spread_levels = [
    		{ active: /*active*/ ctx[18] },
    		prefixFilter(/*$$restProps*/ ctx[24], "tabIndicator$")
    	];

    	let tabindicator_props = {
    		$$slots: { default: [create_default_slot_1$1] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < tabindicator_spread_levels.length; i += 1) {
    		tabindicator_props = assign(tabindicator_props, tabindicator_spread_levels[i]);
    	}

    	tabindicator = new TabIndicator({
    			props: tabindicator_props,
    			$$inline: true
    		});

    	/*tabindicator_binding_1*/ ctx[33](tabindicator);

    	const block = {
    		c: function create() {
    			create_component(tabindicator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabindicator, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabindicator_changes = (dirty[0] & /*active, $$restProps*/ 17039360)
    			? get_spread_update(tabindicator_spread_levels, [
    					dirty[0] & /*active*/ 262144 && { active: /*active*/ ctx[18] },
    					dirty[0] & /*$$restProps*/ 16777216 && get_spread_object(prefixFilter(/*$$restProps*/ ctx[24], "tabIndicator$"))
    				])
    			: {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				tabindicator_changes.$$scope = { dirty, ctx };
    			}

    			tabindicator.$set(tabindicator_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabindicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabindicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*tabindicator_binding_1*/ ctx[33](null);
    			destroy_component(tabindicator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(57:2) {#if !indicatorSpanOnlyContent}",
    		ctx
    	});

    	return block;
    }

    // (58:4) <TabIndicator       bind:this={tabIndicator}       {active}       {...prefixFilter($$restProps, 'tabIndicator$')}       >
    function create_default_slot_1$1(ctx) {
    	let current;
    	const tab_indicator_slot_template = /*#slots*/ ctx[30]["tab-indicator"];
    	const tab_indicator_slot = create_slot(tab_indicator_slot_template, ctx, /*$$scope*/ ctx[35], get_tab_indicator_slot_context_1);

    	const block = {
    		c: function create() {
    			if (tab_indicator_slot) tab_indicator_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (tab_indicator_slot) {
    				tab_indicator_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (tab_indicator_slot) {
    				if (tab_indicator_slot.p && dirty[1] & /*$$scope*/ 16) {
    					update_slot(tab_indicator_slot, tab_indicator_slot_template, ctx, /*$$scope*/ ctx[35], dirty, get_tab_indicator_slot_changes_1, get_tab_indicator_slot_context_1);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab_indicator_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab_indicator_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (tab_indicator_slot) tab_indicator_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(58:4) <TabIndicator       bind:this={tabIndicator}       {active}       {...prefixFilter($$restProps, 'tabIndicator$')}       >",
    		ctx
    	});

    	return block;
    }

    // (1:0) <svelte:component   this={component}   bind:this={element}   use={[     [       Ripple,       {         ripple,         unbounded: false,         addClass,         removeClass,         addStyle,       },     ],     forwardEvents,     ...use,   ]}   class={classMap({     [className]: true,     'mdc-tab': true,     'mdc-tab--active': active,     'mdc-tab--stacked': stacked,     'mdc-tab--min-width': minWidth,     ...internalClasses,   })}   style={Object.entries(internalStyles)     .map(([name, value]) => `${name}: ${value};`)     .concat([style])     .join(' ')}   role="tab"   aria-selected={active ? 'true' : 'false'}   tabindex={active || forceAccessible ? '0' : '-1'}   {href}   on:click={instance && instance.handleClick()}   {...internalAttrs}   {...exclude($$restProps, ['content$', 'tabIndicator$'])} >
    function create_default_slot$2(ctx) {
    	let span0;
    	let t0;
    	let span0_class_value;
    	let useActions_action;
    	let t1;
    	let t2;
    	let span1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[30].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[35], null);
    	let if_block0 = /*indicatorSpanOnlyContent*/ ctx[6] && create_if_block_1$1(ctx);

    	let span0_levels = [
    		{
    			class: span0_class_value = classMap({
    				[/*content$class*/ ctx[9]]: true,
    				"mdc-tab__content": true
    			})
    		},
    		prefixFilter(/*$$restProps*/ ctx[24], "content$")
    	];

    	let span0_data = {};

    	for (let i = 0; i < span0_levels.length; i += 1) {
    		span0_data = assign(span0_data, span0_levels[i]);
    	}

    	let if_block1 = !/*indicatorSpanOnlyContent*/ ctx[6] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			span1 = element("span");
    			set_attributes(span0, span0_data);
    			add_location(span0, file$7, 37, 2, 818);
    			attr_dev(span1, "class", "mdc-tab__ripple");
    			add_location(span1, file$7, 64, 2, 1497);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);

    			if (default_slot) {
    				default_slot.m(span0, null);
    			}

    			append_dev(span0, t0);
    			if (if_block0) if_block0.m(span0, null);
    			/*span0_binding*/ ctx[32](span0);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, span1, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(useActions_action = useActions.call(null, span0, /*content$use*/ ctx[8]));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[1] & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[35], dirty, null, null);
    				}
    			}

    			if (/*indicatorSpanOnlyContent*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*indicatorSpanOnlyContent*/ 64) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(span0, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			set_attributes(span0, span0_data = get_spread_update(span0_levels, [
    				(!current || dirty[0] & /*content$class*/ 512 && span0_class_value !== (span0_class_value = classMap({
    					[/*content$class*/ ctx[9]]: true,
    					"mdc-tab__content": true
    				}))) && { class: span0_class_value },
    				dirty[0] & /*$$restProps*/ 16777216 && prefixFilter(/*$$restProps*/ ctx[24], "content$")
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*content$use*/ 256) useActions_action.update.call(null, /*content$use*/ ctx[8]);

    			if (!/*indicatorSpanOnlyContent*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*indicatorSpanOnlyContent*/ 64) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t2.parentNode, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block0) if_block0.d();
    			/*span0_binding*/ ctx[32](null);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(span1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(1:0) <svelte:component   this={component}   bind:this={element}   use={[     [       Ripple,       {         ripple,         unbounded: false,         addClass,         removeClass,         addStyle,       },     ],     forwardEvents,     ...use,   ]}   class={classMap({     [className]: true,     'mdc-tab': true,     'mdc-tab--active': active,     'mdc-tab--stacked': stacked,     'mdc-tab--min-width': minWidth,     ...internalClasses,   })}   style={Object.entries(internalStyles)     .map(([name, value]) => `${name}: ${value};`)     .concat([style])     .join(' ')}   role=\\\"tab\\\"   aria-selected={active ? 'true' : 'false'}   tabindex={active || forceAccessible ? '0' : '-1'}   {href}   on:click={instance && instance.handleClick()}   {...internalAttrs}   {...exclude($$restProps, ['content$', 'tabIndicator$'])} >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{
    			use: [
    				[
    					Ripple,
    					{
    						ripple: /*ripple*/ ctx[3],
    						unbounded: false,
    						addClass: /*addClass*/ ctx[21],
    						removeClass: /*removeClass*/ ctx[22],
    						addStyle: /*addStyle*/ ctx[23]
    					}
    				],
    				/*forwardEvents*/ ctx[20],
    				.../*use*/ ctx[0]
    			]
    		},
    		{
    			class: classMap({
    				[/*className*/ ctx[1]]: true,
    				"mdc-tab": true,
    				"mdc-tab--active": /*active*/ ctx[18],
    				"mdc-tab--stacked": /*stacked*/ ctx[4],
    				"mdc-tab--min-width": /*minWidth*/ ctx[5],
    				.../*internalClasses*/ ctx[15]
    			})
    		},
    		{
    			style: Object.entries(/*internalStyles*/ ctx[16]).map(func$1).concat([/*style*/ ctx[2]]).join(" ")
    		},
    		{ role: "tab" },
    		{
    			"aria-selected": /*active*/ ctx[18] ? "true" : "false"
    		},
    		{
    			tabindex: /*active*/ ctx[18] || /*forceAccessible*/ ctx[19]
    			? "0"
    			: "-1"
    		},
    		{ href: /*href*/ ctx[7] },
    		/*internalAttrs*/ ctx[17],
    		exclude(/*$$restProps*/ ctx[24], ["content$", "tabIndicator$"])
    	];

    	var switch_value = /*component*/ ctx[10];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot$2] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		/*switch_instance_binding*/ ctx[34](switch_instance);

    		switch_instance.$on("click", function () {
    			if (is_function(/*instance*/ ctx[11] && /*instance*/ ctx[11].handleClick())) (/*instance*/ ctx[11] && /*instance*/ ctx[11].handleClick()).apply(this, arguments);
    		});
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			const switch_instance_changes = (dirty[0] & /*ripple, addClass, removeClass, addStyle, forwardEvents, use, className, active, stacked, minWidth, internalClasses, internalStyles, style, forceAccessible, href, internalAttrs, $$restProps*/ 33521855)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty[0] & /*ripple, addClass, removeClass, addStyle, forwardEvents, use*/ 15728649 && {
    						use: [
    							[
    								Ripple,
    								{
    									ripple: /*ripple*/ ctx[3],
    									unbounded: false,
    									addClass: /*addClass*/ ctx[21],
    									removeClass: /*removeClass*/ ctx[22],
    									addStyle: /*addStyle*/ ctx[23]
    								}
    							],
    							/*forwardEvents*/ ctx[20],
    							.../*use*/ ctx[0]
    						]
    					},
    					dirty[0] & /*className, active, stacked, minWidth, internalClasses*/ 294962 && {
    						class: classMap({
    							[/*className*/ ctx[1]]: true,
    							"mdc-tab": true,
    							"mdc-tab--active": /*active*/ ctx[18],
    							"mdc-tab--stacked": /*stacked*/ ctx[4],
    							"mdc-tab--min-width": /*minWidth*/ ctx[5],
    							.../*internalClasses*/ ctx[15]
    						})
    					},
    					dirty[0] & /*internalStyles, style*/ 65540 && {
    						style: Object.entries(/*internalStyles*/ ctx[16]).map(func$1).concat([/*style*/ ctx[2]]).join(" ")
    					},
    					switch_instance_spread_levels[3],
    					dirty[0] & /*active*/ 262144 && {
    						"aria-selected": /*active*/ ctx[18] ? "true" : "false"
    					},
    					dirty[0] & /*active, forceAccessible*/ 786432 && {
    						tabindex: /*active*/ ctx[18] || /*forceAccessible*/ ctx[19]
    						? "0"
    						: "-1"
    					},
    					dirty[0] & /*href*/ 128 && { href: /*href*/ ctx[7] },
    					dirty[0] & /*internalAttrs*/ 131072 && get_spread_object(/*internalAttrs*/ ctx[17]),
    					dirty[0] & /*$$restProps*/ 16777216 && get_spread_object(exclude(/*$$restProps*/ ctx[24], ["content$", "tabIndicator$"]))
    				])
    			: {};

    			if (dirty[0] & /*active, $$restProps, tabIndicator, indicatorSpanOnlyContent, content$class, content, content$use*/ 17064768 | dirty[1] & /*$$scope*/ 16) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[10])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					/*switch_instance_binding*/ ctx[34](switch_instance);

    					switch_instance.$on("click", function () {
    						if (is_function(/*instance*/ ctx[11] && /*instance*/ ctx[11].handleClick())) (/*instance*/ ctx[11] && /*instance*/ ctx[11].handleClick()).apply(this, arguments);
    					});

    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*switch_instance_binding*/ ctx[34](null);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$1 = ([name, value]) => `${name}: ${value};`;

    function instance_1$2($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","style","tab","ripple","stacked","minWidth","indicatorSpanOnlyContent","href","content$use","content$class","component","activate","deactivate","focus","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tab", slots, ['default','tab-indicator']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = "" } = $$props;
    	let { style = "" } = $$props;
    	let { tab: tabId } = $$props;
    	let { ripple = true } = $$props;
    	let { stacked = false } = $$props;
    	let { minWidth = false } = $$props;
    	let { indicatorSpanOnlyContent = false } = $$props;
    	let { href = null } = $$props;
    	let { content$use = [] } = $$props;
    	let { content$class = "" } = $$props;
    	let element;
    	let instance;
    	let content;
    	let tabIndicator;
    	let internalClasses = {};
    	let internalStyles = {};
    	let internalAttrs = {};
    	let focusOnActivate = getContext("SMUI:tab:focusOnActivate");
    	let active = tabId === getContext("SMUI:tab:initialActive");
    	let forceAccessible = false;
    	let { component = href == null ? Button : A } = $$props;
    	setContext("SMUI:label:context", "tab");
    	setContext("SMUI:icon:context", "tab");

    	if (!tabId) {
    		throw new Error("The tab property is required! It should be passed down from the TabBar to the Tab.");
    	}

    	onMount(() => {
    		$$invalidate(11, instance = new MDCTabFoundation({
    				setAttr: addAttr,
    				addClass,
    				removeClass,
    				hasClass,
    				activateIndicator: previousIndicatorClientRect => tabIndicator.activate(previousIndicatorClientRect),
    				deactivateIndicator: () => tabIndicator.deactivate(),
    				notifyInteracted: () => dispatch(getElement(), "MDCTab:interacted", { tabId }),
    				getOffsetLeft: () => getElement().offsetLeft,
    				getOffsetWidth: () => getElement().offsetWidth,
    				getContentOffsetLeft: () => content.offsetLeft,
    				getContentOffsetWidth: () => content.offsetWidth,
    				focus
    			}));

    		const accessor = {
    			tabId,
    			get element() {
    				return getElement();
    			},
    			get active() {
    				return active;
    			},
    			forceAccessible(accessible) {
    				$$invalidate(19, forceAccessible = accessible);
    			},
    			computeIndicatorClientRect: () => tabIndicator.computeContentClientRect(),
    			computeDimensions: () => instance.computeDimensions(),
    			focus,
    			activate,
    			deactivate
    		};

    		dispatch(getElement(), "SMUI:tab:mount", accessor);
    		instance.init();

    		return () => {
    			dispatch(getElement(), "SMUI:tab:unmount", accessor);
    			instance.destroy();
    		};
    	});

    	function hasClass(className) {
    		return className in internalClasses
    		? internalClasses[className]
    		: getElement().classList.contains(className);
    	}

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(15, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(15, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === "" || value == null) {
    				delete internalStyles[name];
    				$$invalidate(16, internalStyles);
    			} else {
    				$$invalidate(16, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function addAttr(name, value) {
    		if (internalAttrs[name] !== value) {
    			$$invalidate(17, internalAttrs[name] = value, internalAttrs);
    		}
    	}

    	function activate(previousIndicatorClientRect, skipFocus) {
    		$$invalidate(18, active = true);

    		if (skipFocus) {
    			instance.setFocusOnActivate(false);
    		}

    		instance.activate(previousIndicatorClientRect);

    		if (skipFocus) {
    			instance.setFocusOnActivate(focusOnActivate);
    		}
    	}

    	function deactivate() {
    		$$invalidate(18, active = false);
    		instance.deactivate();
    	}

    	function focus() {
    		getElement().focus();
    	}

    	function getElement() {
    		return element.getElement();
    	}

    	function tabindicator_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			tabIndicator = $$value;
    			$$invalidate(14, tabIndicator);
    		});
    	}

    	function span0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			content = $$value;
    			$$invalidate(13, content);
    		});
    	}

    	function tabindicator_binding_1($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			tabIndicator = $$value;
    			$$invalidate(14, tabIndicator);
    		});
    	}

    	function switch_instance_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			element = $$value;
    			$$invalidate(12, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(24, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("use" in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ("class" in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ("style" in $$new_props) $$invalidate(2, style = $$new_props.style);
    		if ("tab" in $$new_props) $$invalidate(25, tabId = $$new_props.tab);
    		if ("ripple" in $$new_props) $$invalidate(3, ripple = $$new_props.ripple);
    		if ("stacked" in $$new_props) $$invalidate(4, stacked = $$new_props.stacked);
    		if ("minWidth" in $$new_props) $$invalidate(5, minWidth = $$new_props.minWidth);
    		if ("indicatorSpanOnlyContent" in $$new_props) $$invalidate(6, indicatorSpanOnlyContent = $$new_props.indicatorSpanOnlyContent);
    		if ("href" in $$new_props) $$invalidate(7, href = $$new_props.href);
    		if ("content$use" in $$new_props) $$invalidate(8, content$use = $$new_props.content$use);
    		if ("content$class" in $$new_props) $$invalidate(9, content$class = $$new_props.content$class);
    		if ("component" in $$new_props) $$invalidate(10, component = $$new_props.component);
    		if ("$$scope" in $$new_props) $$invalidate(35, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCTabFoundation,
    		onMount,
    		setContext,
    		getContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		dispatch,
    		Ripple,
    		A,
    		Button,
    		TabIndicator,
    		forwardEvents,
    		use,
    		className,
    		style,
    		tabId,
    		ripple,
    		stacked,
    		minWidth,
    		indicatorSpanOnlyContent,
    		href,
    		content$use,
    		content$class,
    		element,
    		instance,
    		content,
    		tabIndicator,
    		internalClasses,
    		internalStyles,
    		internalAttrs,
    		focusOnActivate,
    		active,
    		forceAccessible,
    		component,
    		hasClass,
    		addClass,
    		removeClass,
    		addStyle,
    		addAttr,
    		activate,
    		deactivate,
    		focus,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("use" in $$props) $$invalidate(0, use = $$new_props.use);
    		if ("className" in $$props) $$invalidate(1, className = $$new_props.className);
    		if ("style" in $$props) $$invalidate(2, style = $$new_props.style);
    		if ("tabId" in $$props) $$invalidate(25, tabId = $$new_props.tabId);
    		if ("ripple" in $$props) $$invalidate(3, ripple = $$new_props.ripple);
    		if ("stacked" in $$props) $$invalidate(4, stacked = $$new_props.stacked);
    		if ("minWidth" in $$props) $$invalidate(5, minWidth = $$new_props.minWidth);
    		if ("indicatorSpanOnlyContent" in $$props) $$invalidate(6, indicatorSpanOnlyContent = $$new_props.indicatorSpanOnlyContent);
    		if ("href" in $$props) $$invalidate(7, href = $$new_props.href);
    		if ("content$use" in $$props) $$invalidate(8, content$use = $$new_props.content$use);
    		if ("content$class" in $$props) $$invalidate(9, content$class = $$new_props.content$class);
    		if ("element" in $$props) $$invalidate(12, element = $$new_props.element);
    		if ("instance" in $$props) $$invalidate(11, instance = $$new_props.instance);
    		if ("content" in $$props) $$invalidate(13, content = $$new_props.content);
    		if ("tabIndicator" in $$props) $$invalidate(14, tabIndicator = $$new_props.tabIndicator);
    		if ("internalClasses" in $$props) $$invalidate(15, internalClasses = $$new_props.internalClasses);
    		if ("internalStyles" in $$props) $$invalidate(16, internalStyles = $$new_props.internalStyles);
    		if ("internalAttrs" in $$props) $$invalidate(17, internalAttrs = $$new_props.internalAttrs);
    		if ("focusOnActivate" in $$props) $$invalidate(36, focusOnActivate = $$new_props.focusOnActivate);
    		if ("active" in $$props) $$invalidate(18, active = $$new_props.active);
    		if ("forceAccessible" in $$props) $$invalidate(19, forceAccessible = $$new_props.forceAccessible);
    		if ("component" in $$props) $$invalidate(10, component = $$new_props.component);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*instance*/ 2048) {
    			if (instance) {
    				instance.setFocusOnActivate(focusOnActivate);
    			}
    		}
    	};

    	return [
    		use,
    		className,
    		style,
    		ripple,
    		stacked,
    		minWidth,
    		indicatorSpanOnlyContent,
    		href,
    		content$use,
    		content$class,
    		component,
    		instance,
    		element,
    		content,
    		tabIndicator,
    		internalClasses,
    		internalStyles,
    		internalAttrs,
    		active,
    		forceAccessible,
    		forwardEvents,
    		addClass,
    		removeClass,
    		addStyle,
    		$$restProps,
    		tabId,
    		activate,
    		deactivate,
    		focus,
    		getElement,
    		slots,
    		tabindicator_binding,
    		span0_binding,
    		tabindicator_binding_1,
    		switch_instance_binding,
    		$$scope
    	];
    }

    class Tab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1$2,
    			create_fragment$7,
    			safe_not_equal,
    			{
    				use: 0,
    				class: 1,
    				style: 2,
    				tab: 25,
    				ripple: 3,
    				stacked: 4,
    				minWidth: 5,
    				indicatorSpanOnlyContent: 6,
    				href: 7,
    				content$use: 8,
    				content$class: 9,
    				component: 10,
    				activate: 26,
    				deactivate: 27,
    				focus: 28,
    				getElement: 29
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*tabId*/ ctx[25] === undefined && !("tab" in props)) {
    			console.warn("<Tab> was created without expected prop 'tab'");
    		}
    	}

    	get use() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tab() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tab(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stacked() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stacked(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minWidth() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minWidth(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get indicatorSpanOnlyContent() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set indicatorSpanOnlyContent(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get content$use() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content$use(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get content$class() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content$class(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activate() {
    		return this.$$.ctx[26];
    	}

    	set activate(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get deactivate() {
    		return this.$$.ctx[27];
    	}

    	set deactivate(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focus() {
    		return this.$$.ctx[28];
    	}

    	set focus(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[29];
    	}

    	set getElement(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/common/CommonLabel.svelte generated by Svelte v3.37.0 */
    const file$6 = "node_modules/@smui/common/CommonLabel.svelte";

    function create_fragment$6(ctx) {
    	let span;
    	let span_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let span_levels = [
    		{
    			class: span_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				"mdc-button__label": /*context*/ ctx[4] === "button",
    				"mdc-fab__label": /*context*/ ctx[4] === "fab",
    				"mdc-tab__text-label": /*context*/ ctx[4] === "tab",
    				"mdc-image-list__label": /*context*/ ctx[4] === "image-list",
    				"mdc-snackbar__label": /*context*/ ctx[4] === "snackbar",
    				"mdc-banner__text": /*context*/ ctx[4] === "banner",
    				"mdc-segmented-button__label": /*context*/ ctx[4] === "segmented-button",
    				"mdc-data-table__pagination-rows-per-page-label": /*context*/ ctx[4] === "data-table:pagination",
    				"mdc-data-table__header-cell-label": /*context*/ ctx[4] === "data-table:sortable-header-cell"
    			})
    		},
    		/*context*/ ctx[4] === "snackbar"
    		? { "aria-atomic": "false" }
    		: {},
    		{ tabindex: /*tabindex*/ ctx[5] },
    		/*$$restProps*/ ctx[6]
    	];

    	let span_data = {};

    	for (let i = 0; i < span_levels.length; i += 1) {
    		span_data = assign(span_data, span_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			set_attributes(span, span_data);
    			add_location(span, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			/*span_binding*/ ctx[10](span);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, span, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[3].call(null, span))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}

    			set_attributes(span, span_data = get_spread_update(span_levels, [
    				(!current || dirty & /*className*/ 2 && span_class_value !== (span_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					"mdc-button__label": /*context*/ ctx[4] === "button",
    					"mdc-fab__label": /*context*/ ctx[4] === "fab",
    					"mdc-tab__text-label": /*context*/ ctx[4] === "tab",
    					"mdc-image-list__label": /*context*/ ctx[4] === "image-list",
    					"mdc-snackbar__label": /*context*/ ctx[4] === "snackbar",
    					"mdc-banner__text": /*context*/ ctx[4] === "banner",
    					"mdc-segmented-button__label": /*context*/ ctx[4] === "segmented-button",
    					"mdc-data-table__pagination-rows-per-page-label": /*context*/ ctx[4] === "data-table:pagination",
    					"mdc-data-table__header-cell-label": /*context*/ ctx[4] === "data-table:sortable-header-cell"
    				}))) && { class: span_class_value },
    				/*context*/ ctx[4] === "snackbar"
    				? { "aria-atomic": "false" }
    				: {},
    				{ tabindex: /*tabindex*/ ctx[5] },
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
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
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    			/*span_binding*/ ctx[10](null);
    			mounted = false;
    			run_all(dispose);
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

    function instance$4($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CommonLabel", slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = "" } = $$props;
    	let element;
    	const context = getContext("SMUI:label:context");
    	const tabindex = getContext("SMUI:label:tabindex");

    	function getElement() {
    		return element;
    	}

    	function span_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("use" in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ("class" in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		element,
    		context,
    		tabindex,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("use" in $$props) $$invalidate(0, use = $$new_props.use);
    		if ("className" in $$props) $$invalidate(1, className = $$new_props.className);
    		if ("element" in $$props) $$invalidate(2, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		element,
    		forwardEvents,
    		context,
    		tabindex,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		span_binding
    	];
    }

    class CommonLabel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$6, safe_not_equal, { use: 0, class: 1, getElement: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CommonLabel",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get use() {
    		throw new Error("<CommonLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<CommonLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[7];
    	}

    	set getElement(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses = {
        ANIMATING: 'mdc-tab-scroller--animating',
        SCROLL_AREA_SCROLL: 'mdc-tab-scroller__scroll-area--scroll',
        SCROLL_TEST: 'mdc-tab-scroller__test',
    };
    var strings$1 = {
        AREA_SELECTOR: '.mdc-tab-scroller__scroll-area',
        CONTENT_SELECTOR: '.mdc-tab-scroller__scroll-content',
    };

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabScrollerRTL = /** @class */ (function () {
        function MDCTabScrollerRTL(adapter) {
            this.adapter = adapter;
        }
        return MDCTabScrollerRTL;
    }());

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabScrollerRTLDefault = /** @class */ (function (_super) {
        __extends(MDCTabScrollerRTLDefault, _super);
        function MDCTabScrollerRTLDefault() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MDCTabScrollerRTLDefault.prototype.getScrollPositionRTL = function () {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var right = this.calculateScrollEdges_().right;
            // Scroll values on most browsers are ints instead of floats so we round
            return Math.round(right - currentScrollLeft);
        };
        MDCTabScrollerRTLDefault.prototype.scrollToRTL = function (scrollX) {
            var edges = this.calculateScrollEdges_();
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var clampedScrollLeft = this.clampScrollValue_(edges.right - scrollX);
            return {
                finalScrollPosition: clampedScrollLeft,
                scrollDelta: clampedScrollLeft - currentScrollLeft,
            };
        };
        MDCTabScrollerRTLDefault.prototype.incrementScrollRTL = function (scrollX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var clampedScrollLeft = this.clampScrollValue_(currentScrollLeft - scrollX);
            return {
                finalScrollPosition: clampedScrollLeft,
                scrollDelta: clampedScrollLeft - currentScrollLeft,
            };
        };
        MDCTabScrollerRTLDefault.prototype.getAnimatingScrollPosition = function (scrollX) {
            return scrollX;
        };
        MDCTabScrollerRTLDefault.prototype.calculateScrollEdges_ = function () {
            var contentWidth = this.adapter.getScrollContentOffsetWidth();
            var rootWidth = this.adapter.getScrollAreaOffsetWidth();
            return {
                left: 0,
                right: contentWidth - rootWidth,
            };
        };
        MDCTabScrollerRTLDefault.prototype.clampScrollValue_ = function (scrollX) {
            var edges = this.calculateScrollEdges_();
            return Math.min(Math.max(edges.left, scrollX), edges.right);
        };
        return MDCTabScrollerRTLDefault;
    }(MDCTabScrollerRTL));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabScrollerRTLNegative = /** @class */ (function (_super) {
        __extends(MDCTabScrollerRTLNegative, _super);
        function MDCTabScrollerRTLNegative() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MDCTabScrollerRTLNegative.prototype.getScrollPositionRTL = function (translateX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            return Math.round(translateX - currentScrollLeft);
        };
        MDCTabScrollerRTLNegative.prototype.scrollToRTL = function (scrollX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var clampedScrollLeft = this.clampScrollValue_(-scrollX);
            return {
                finalScrollPosition: clampedScrollLeft,
                scrollDelta: clampedScrollLeft - currentScrollLeft,
            };
        };
        MDCTabScrollerRTLNegative.prototype.incrementScrollRTL = function (scrollX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var clampedScrollLeft = this.clampScrollValue_(currentScrollLeft - scrollX);
            return {
                finalScrollPosition: clampedScrollLeft,
                scrollDelta: clampedScrollLeft - currentScrollLeft,
            };
        };
        MDCTabScrollerRTLNegative.prototype.getAnimatingScrollPosition = function (scrollX, translateX) {
            return scrollX - translateX;
        };
        MDCTabScrollerRTLNegative.prototype.calculateScrollEdges_ = function () {
            var contentWidth = this.adapter.getScrollContentOffsetWidth();
            var rootWidth = this.adapter.getScrollAreaOffsetWidth();
            return {
                left: rootWidth - contentWidth,
                right: 0,
            };
        };
        MDCTabScrollerRTLNegative.prototype.clampScrollValue_ = function (scrollX) {
            var edges = this.calculateScrollEdges_();
            return Math.max(Math.min(edges.right, scrollX), edges.left);
        };
        return MDCTabScrollerRTLNegative;
    }(MDCTabScrollerRTL));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabScrollerRTLReverse = /** @class */ (function (_super) {
        __extends(MDCTabScrollerRTLReverse, _super);
        function MDCTabScrollerRTLReverse() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MDCTabScrollerRTLReverse.prototype.getScrollPositionRTL = function (translateX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            // Scroll values on most browsers are ints instead of floats so we round
            return Math.round(currentScrollLeft - translateX);
        };
        MDCTabScrollerRTLReverse.prototype.scrollToRTL = function (scrollX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var clampedScrollLeft = this.clampScrollValue_(scrollX);
            return {
                finalScrollPosition: clampedScrollLeft,
                scrollDelta: currentScrollLeft - clampedScrollLeft,
            };
        };
        MDCTabScrollerRTLReverse.prototype.incrementScrollRTL = function (scrollX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var clampedScrollLeft = this.clampScrollValue_(currentScrollLeft + scrollX);
            return {
                finalScrollPosition: clampedScrollLeft,
                scrollDelta: currentScrollLeft - clampedScrollLeft,
            };
        };
        MDCTabScrollerRTLReverse.prototype.getAnimatingScrollPosition = function (scrollX, translateX) {
            return scrollX + translateX;
        };
        MDCTabScrollerRTLReverse.prototype.calculateScrollEdges_ = function () {
            var contentWidth = this.adapter.getScrollContentOffsetWidth();
            var rootWidth = this.adapter.getScrollAreaOffsetWidth();
            return {
                left: contentWidth - rootWidth,
                right: 0,
            };
        };
        MDCTabScrollerRTLReverse.prototype.clampScrollValue_ = function (scrollX) {
            var edges = this.calculateScrollEdges_();
            return Math.min(Math.max(edges.right, scrollX), edges.left);
        };
        return MDCTabScrollerRTLReverse;
    }(MDCTabScrollerRTL));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabScrollerFoundation = /** @class */ (function (_super) {
        __extends(MDCTabScrollerFoundation, _super);
        function MDCTabScrollerFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCTabScrollerFoundation.defaultAdapter), adapter)) || this;
            /**
             * Controls whether we should handle the transitionend and interaction events during the animation.
             */
            _this.isAnimating_ = false;
            return _this;
        }
        Object.defineProperty(MDCTabScrollerFoundation, "cssClasses", {
            get: function () {
                return cssClasses;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabScrollerFoundation, "strings", {
            get: function () {
                return strings$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabScrollerFoundation, "defaultAdapter", {
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    eventTargetMatchesSelector: function () { return false; },
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    addScrollAreaClass: function () { return undefined; },
                    setScrollAreaStyleProperty: function () { return undefined; },
                    setScrollContentStyleProperty: function () { return undefined; },
                    getScrollContentStyleValue: function () { return ''; },
                    setScrollAreaScrollLeft: function () { return undefined; },
                    getScrollAreaScrollLeft: function () { return 0; },
                    getScrollContentOffsetWidth: function () { return 0; },
                    getScrollAreaOffsetWidth: function () { return 0; },
                    computeScrollAreaClientRect: function () { return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }); },
                    computeScrollContentClientRect: function () { return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }); },
                    computeHorizontalScrollbarHeight: function () { return 0; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        MDCTabScrollerFoundation.prototype.init = function () {
            // Compute horizontal scrollbar height on scroller with overflow initially hidden, then update overflow to scroll
            // and immediately adjust bottom margin to avoid the scrollbar initially appearing before JS runs.
            var horizontalScrollbarHeight = this.adapter.computeHorizontalScrollbarHeight();
            this.adapter.setScrollAreaStyleProperty('margin-bottom', -horizontalScrollbarHeight + 'px');
            this.adapter.addScrollAreaClass(MDCTabScrollerFoundation.cssClasses.SCROLL_AREA_SCROLL);
        };
        /**
         * Computes the current visual scroll position
         */
        MDCTabScrollerFoundation.prototype.getScrollPosition = function () {
            if (this.isRTL_()) {
                return this.computeCurrentScrollPositionRTL_();
            }
            var currentTranslateX = this.calculateCurrentTranslateX_();
            var scrollLeft = this.adapter.getScrollAreaScrollLeft();
            return scrollLeft - currentTranslateX;
        };
        /**
         * Handles interaction events that occur during transition
         */
        MDCTabScrollerFoundation.prototype.handleInteraction = function () {
            // Early exit if we aren't animating
            if (!this.isAnimating_) {
                return;
            }
            // Prevent other event listeners from handling this event
            this.stopScrollAnimation_();
        };
        /**
         * Handles the transitionend event
         */
        MDCTabScrollerFoundation.prototype.handleTransitionEnd = function (evt) {
            // Early exit if we aren't animating or the event was triggered by a different element.
            var evtTarget = evt.target;
            if (!this.isAnimating_ ||
                !this.adapter.eventTargetMatchesSelector(evtTarget, MDCTabScrollerFoundation.strings.CONTENT_SELECTOR)) {
                return;
            }
            this.isAnimating_ = false;
            this.adapter.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
        };
        /**
         * Increment the scroll value by the scrollXIncrement using animation.
         * @param scrollXIncrement The value by which to increment the scroll position
         */
        MDCTabScrollerFoundation.prototype.incrementScroll = function (scrollXIncrement) {
            // Early exit for non-operational increment values
            if (scrollXIncrement === 0) {
                return;
            }
            this.animate_(this.getIncrementScrollOperation_(scrollXIncrement));
        };
        /**
         * Increment the scroll value by the scrollXIncrement without animation.
         * @param scrollXIncrement The value by which to increment the scroll position
         */
        MDCTabScrollerFoundation.prototype.incrementScrollImmediate = function (scrollXIncrement) {
            // Early exit for non-operational increment values
            if (scrollXIncrement === 0) {
                return;
            }
            var operation = this.getIncrementScrollOperation_(scrollXIncrement);
            if (operation.scrollDelta === 0) {
                return;
            }
            this.stopScrollAnimation_();
            this.adapter.setScrollAreaScrollLeft(operation.finalScrollPosition);
        };
        /**
         * Scrolls to the given scrollX value
         */
        MDCTabScrollerFoundation.prototype.scrollTo = function (scrollX) {
            if (this.isRTL_()) {
                return this.scrollToRTL_(scrollX);
            }
            this.scrollTo_(scrollX);
        };
        /**
         * @return Browser-specific {@link MDCTabScrollerRTL} instance.
         */
        MDCTabScrollerFoundation.prototype.getRTLScroller = function () {
            if (!this.rtlScrollerInstance_) {
                this.rtlScrollerInstance_ = this.rtlScrollerFactory_();
            }
            return this.rtlScrollerInstance_;
        };
        /**
         * @return translateX value from a CSS matrix transform function string.
         */
        MDCTabScrollerFoundation.prototype.calculateCurrentTranslateX_ = function () {
            var transformValue = this.adapter.getScrollContentStyleValue('transform');
            // Early exit if no transform is present
            if (transformValue === 'none') {
                return 0;
            }
            // The transform value comes back as a matrix transformation in the form
            // of `matrix(a, b, c, d, tx, ty)`. We only care about tx (translateX) so
            // we're going to grab all the parenthesized values, strip out tx, and
            // parse it.
            var match = /\((.+?)\)/.exec(transformValue);
            if (!match) {
                return 0;
            }
            var matrixParams = match[1];
            // tslint:disable-next-line:ban-ts-ignore "Unused vars" should be a linter warning, not a compiler error.
            // @ts-ignore These unused variables should retain their semantic names for clarity.
            var _a = __read(matrixParams.split(','), 6); _a[0]; _a[1]; _a[2]; _a[3]; var tx = _a[4]; _a[5];
            return parseFloat(tx); // tslint:disable-line:ban
        };
        /**
         * Calculates a safe scroll value that is > 0 and < the max scroll value
         * @param scrollX The distance to scroll
         */
        MDCTabScrollerFoundation.prototype.clampScrollValue_ = function (scrollX) {
            var edges = this.calculateScrollEdges_();
            return Math.min(Math.max(edges.left, scrollX), edges.right);
        };
        MDCTabScrollerFoundation.prototype.computeCurrentScrollPositionRTL_ = function () {
            var translateX = this.calculateCurrentTranslateX_();
            return this.getRTLScroller().getScrollPositionRTL(translateX);
        };
        MDCTabScrollerFoundation.prototype.calculateScrollEdges_ = function () {
            var contentWidth = this.adapter.getScrollContentOffsetWidth();
            var rootWidth = this.adapter.getScrollAreaOffsetWidth();
            return {
                left: 0,
                right: contentWidth - rootWidth,
            };
        };
        /**
         * Internal scroll method
         * @param scrollX The new scroll position
         */
        MDCTabScrollerFoundation.prototype.scrollTo_ = function (scrollX) {
            var currentScrollX = this.getScrollPosition();
            var safeScrollX = this.clampScrollValue_(scrollX);
            var scrollDelta = safeScrollX - currentScrollX;
            this.animate_({
                finalScrollPosition: safeScrollX,
                scrollDelta: scrollDelta,
            });
        };
        /**
         * Internal RTL scroll method
         * @param scrollX The new scroll position
         */
        MDCTabScrollerFoundation.prototype.scrollToRTL_ = function (scrollX) {
            var animation = this.getRTLScroller().scrollToRTL(scrollX);
            this.animate_(animation);
        };
        /**
         * Internal method to compute the increment scroll operation values.
         * @param scrollX The desired scroll position increment
         * @return MDCTabScrollerAnimation with the sanitized values for performing the scroll operation.
         */
        MDCTabScrollerFoundation.prototype.getIncrementScrollOperation_ = function (scrollX) {
            if (this.isRTL_()) {
                return this.getRTLScroller().incrementScrollRTL(scrollX);
            }
            var currentScrollX = this.getScrollPosition();
            var targetScrollX = scrollX + currentScrollX;
            var safeScrollX = this.clampScrollValue_(targetScrollX);
            var scrollDelta = safeScrollX - currentScrollX;
            return {
                finalScrollPosition: safeScrollX,
                scrollDelta: scrollDelta,
            };
        };
        /**
         * Animates the tab scrolling
         * @param animation The animation to apply
         */
        MDCTabScrollerFoundation.prototype.animate_ = function (animation) {
            var _this = this;
            // Early exit if translateX is 0, which means there's no animation to perform
            if (animation.scrollDelta === 0) {
                return;
            }
            this.stopScrollAnimation_();
            // This animation uses the FLIP approach.
            // Read more here: https://aerotwist.com/blog/flip-your-animations/
            this.adapter.setScrollAreaScrollLeft(animation.finalScrollPosition);
            this.adapter.setScrollContentStyleProperty('transform', "translateX(" + animation.scrollDelta + "px)");
            // Force repaint
            this.adapter.computeScrollAreaClientRect();
            requestAnimationFrame(function () {
                _this.adapter.addClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
                _this.adapter.setScrollContentStyleProperty('transform', 'none');
            });
            this.isAnimating_ = true;
        };
        /**
         * Stops scroll animation
         */
        MDCTabScrollerFoundation.prototype.stopScrollAnimation_ = function () {
            this.isAnimating_ = false;
            var currentScrollPosition = this.getAnimatingScrollPosition_();
            this.adapter.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
            this.adapter.setScrollContentStyleProperty('transform', 'translateX(0px)');
            this.adapter.setScrollAreaScrollLeft(currentScrollPosition);
        };
        /**
         * Gets the current scroll position during animation
         */
        MDCTabScrollerFoundation.prototype.getAnimatingScrollPosition_ = function () {
            var currentTranslateX = this.calculateCurrentTranslateX_();
            var scrollLeft = this.adapter.getScrollAreaScrollLeft();
            if (this.isRTL_()) {
                return this.getRTLScroller().getAnimatingScrollPosition(scrollLeft, currentTranslateX);
            }
            return scrollLeft - currentTranslateX;
        };
        /**
         * Determines the RTL Scroller to use
         */
        MDCTabScrollerFoundation.prototype.rtlScrollerFactory_ = function () {
            // Browsers have three different implementations of scrollLeft in RTL mode,
            // dependent on the browser. The behavior is based off the max LTR
            // scrollLeft value and 0.
            //
            // * Default scrolling in RTL *
            //    - Left-most value: 0
            //    - Right-most value: Max LTR scrollLeft value
            //
            // * Negative scrolling in RTL *
            //    - Left-most value: Negated max LTR scrollLeft value
            //    - Right-most value: 0
            //
            // * Reverse scrolling in RTL *
            //    - Left-most value: Max LTR scrollLeft value
            //    - Right-most value: 0
            //
            // We use those principles below to determine which RTL scrollLeft
            // behavior is implemented in the current browser.
            var initialScrollLeft = this.adapter.getScrollAreaScrollLeft();
            this.adapter.setScrollAreaScrollLeft(initialScrollLeft - 1);
            var newScrollLeft = this.adapter.getScrollAreaScrollLeft();
            // If the newScrollLeft value is negative,then we know that the browser has
            // implemented negative RTL scrolling, since all other implementations have
            // only positive values.
            if (newScrollLeft < 0) {
                // Undo the scrollLeft test check
                this.adapter.setScrollAreaScrollLeft(initialScrollLeft);
                return new MDCTabScrollerRTLNegative(this.adapter);
            }
            var rootClientRect = this.adapter.computeScrollAreaClientRect();
            var contentClientRect = this.adapter.computeScrollContentClientRect();
            var rightEdgeDelta = Math.round(contentClientRect.right - rootClientRect.right);
            // Undo the scrollLeft test check
            this.adapter.setScrollAreaScrollLeft(initialScrollLeft);
            // By calculating the clientRect of the root element and the clientRect of
            // the content element, we can determine how much the scroll value changed
            // when we performed the scrollLeft subtraction above.
            if (rightEdgeDelta === newScrollLeft) {
                return new MDCTabScrollerRTLReverse(this.adapter);
            }
            return new MDCTabScrollerRTLDefault(this.adapter);
        };
        MDCTabScrollerFoundation.prototype.isRTL_ = function () {
            return this.adapter.getScrollContentStyleValue('direction') === 'rtl';
        };
        return MDCTabScrollerFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * Stores result from computeHorizontalScrollbarHeight to avoid redundant processing.
     */
    var horizontalScrollbarHeight_;
    /**
     * Computes the height of browser-rendered horizontal scrollbars using a self-created test element.
     * May return 0 (e.g. on OS X browsers under default configuration).
     */
    function computeHorizontalScrollbarHeight(documentObj, shouldCacheResult) {
        if (shouldCacheResult === void 0) { shouldCacheResult = true; }
        if (shouldCacheResult && typeof horizontalScrollbarHeight_ !== 'undefined') {
            return horizontalScrollbarHeight_;
        }
        var el = documentObj.createElement('div');
        el.classList.add(cssClasses.SCROLL_TEST);
        documentObj.body.appendChild(el);
        var horizontalScrollbarHeight = el.offsetHeight - el.clientHeight;
        documentObj.body.removeChild(el);
        if (shouldCacheResult) {
            horizontalScrollbarHeight_ = horizontalScrollbarHeight;
        }
        return horizontalScrollbarHeight;
    }

    var util = /*#__PURE__*/Object.freeze({
        __proto__: null,
        computeHorizontalScrollbarHeight: computeHorizontalScrollbarHeight
    });

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var strings = {
        ARROW_LEFT_KEY: 'ArrowLeft',
        ARROW_RIGHT_KEY: 'ArrowRight',
        END_KEY: 'End',
        ENTER_KEY: 'Enter',
        HOME_KEY: 'Home',
        SPACE_KEY: 'Space',
        TAB_ACTIVATED_EVENT: 'MDCTabBar:activated',
        TAB_SCROLLER_SELECTOR: '.mdc-tab-scroller',
        TAB_SELECTOR: '.mdc-tab',
    };
    var numbers = {
        ARROW_LEFT_KEYCODE: 37,
        ARROW_RIGHT_KEYCODE: 39,
        END_KEYCODE: 35,
        ENTER_KEYCODE: 13,
        EXTRA_SCROLL_AMOUNT: 20,
        HOME_KEYCODE: 36,
        SPACE_KEYCODE: 32,
    };

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var ACCEPTABLE_KEYS = new Set();
    // IE11 has no support for new Set with iterable so we need to initialize this by hand
    ACCEPTABLE_KEYS.add(strings.ARROW_LEFT_KEY);
    ACCEPTABLE_KEYS.add(strings.ARROW_RIGHT_KEY);
    ACCEPTABLE_KEYS.add(strings.END_KEY);
    ACCEPTABLE_KEYS.add(strings.HOME_KEY);
    ACCEPTABLE_KEYS.add(strings.ENTER_KEY);
    ACCEPTABLE_KEYS.add(strings.SPACE_KEY);
    var KEYCODE_MAP = new Map();
    // IE11 has no support for new Map with iterable so we need to initialize this by hand
    KEYCODE_MAP.set(numbers.ARROW_LEFT_KEYCODE, strings.ARROW_LEFT_KEY);
    KEYCODE_MAP.set(numbers.ARROW_RIGHT_KEYCODE, strings.ARROW_RIGHT_KEY);
    KEYCODE_MAP.set(numbers.END_KEYCODE, strings.END_KEY);
    KEYCODE_MAP.set(numbers.HOME_KEYCODE, strings.HOME_KEY);
    KEYCODE_MAP.set(numbers.ENTER_KEYCODE, strings.ENTER_KEY);
    KEYCODE_MAP.set(numbers.SPACE_KEYCODE, strings.SPACE_KEY);
    var MDCTabBarFoundation = /** @class */ (function (_super) {
        __extends(MDCTabBarFoundation, _super);
        function MDCTabBarFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCTabBarFoundation.defaultAdapter), adapter)) || this;
            _this.useAutomaticActivation_ = false;
            return _this;
        }
        Object.defineProperty(MDCTabBarFoundation, "strings", {
            get: function () {
                return strings;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabBarFoundation, "numbers", {
            get: function () {
                return numbers;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabBarFoundation, "defaultAdapter", {
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    scrollTo: function () { return undefined; },
                    incrementScroll: function () { return undefined; },
                    getScrollPosition: function () { return 0; },
                    getScrollContentWidth: function () { return 0; },
                    getOffsetWidth: function () { return 0; },
                    isRTL: function () { return false; },
                    setActiveTab: function () { return undefined; },
                    activateTabAtIndex: function () { return undefined; },
                    deactivateTabAtIndex: function () { return undefined; },
                    focusTabAtIndex: function () { return undefined; },
                    getTabIndicatorClientRectAtIndex: function () { return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }); },
                    getTabDimensionsAtIndex: function () { return ({ rootLeft: 0, rootRight: 0, contentLeft: 0, contentRight: 0 }); },
                    getPreviousActiveTabIndex: function () { return -1; },
                    getFocusedTabIndex: function () { return -1; },
                    getIndexOfTabById: function () { return -1; },
                    getTabListLength: function () { return 0; },
                    notifyTabActivated: function () { return undefined; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Switches between automatic and manual activation modes.
         * See https://www.w3.org/TR/wai-aria-practices/#tabpanel for examples.
         */
        MDCTabBarFoundation.prototype.setUseAutomaticActivation = function (useAutomaticActivation) {
            this.useAutomaticActivation_ = useAutomaticActivation;
        };
        MDCTabBarFoundation.prototype.activateTab = function (index) {
            var previousActiveIndex = this.adapter.getPreviousActiveTabIndex();
            if (!this.indexIsInRange_(index) || index === previousActiveIndex) {
                return;
            }
            var previousClientRect;
            if (previousActiveIndex !== -1) {
                this.adapter.deactivateTabAtIndex(previousActiveIndex);
                previousClientRect =
                    this.adapter.getTabIndicatorClientRectAtIndex(previousActiveIndex);
            }
            this.adapter.activateTabAtIndex(index, previousClientRect);
            this.scrollIntoView(index);
            this.adapter.notifyTabActivated(index);
        };
        MDCTabBarFoundation.prototype.handleKeyDown = function (evt) {
            // Get the key from the event
            var key = this.getKeyFromEvent_(evt);
            // Early exit if the event key isn't one of the keyboard navigation keys
            if (key === undefined) {
                return;
            }
            // Prevent default behavior for movement keys, but not for activation keys, since :active is used to apply ripple
            if (!this.isActivationKey_(key)) {
                evt.preventDefault();
            }
            if (this.useAutomaticActivation_) {
                if (this.isActivationKey_(key)) {
                    return;
                }
                var index = this.determineTargetFromKey_(this.adapter.getPreviousActiveTabIndex(), key);
                this.adapter.setActiveTab(index);
                this.scrollIntoView(index);
            }
            else {
                var focusedTabIndex = this.adapter.getFocusedTabIndex();
                if (this.isActivationKey_(key)) {
                    this.adapter.setActiveTab(focusedTabIndex);
                }
                else {
                    var index = this.determineTargetFromKey_(focusedTabIndex, key);
                    this.adapter.focusTabAtIndex(index);
                    this.scrollIntoView(index);
                }
            }
        };
        /**
         * Handles the MDCTab:interacted event
         */
        MDCTabBarFoundation.prototype.handleTabInteraction = function (evt) {
            this.adapter.setActiveTab(this.adapter.getIndexOfTabById(evt.detail.tabId));
        };
        /**
         * Scrolls the tab at the given index into view
         * @param index The tab index to make visible
         */
        MDCTabBarFoundation.prototype.scrollIntoView = function (index) {
            // Early exit if the index is out of range
            if (!this.indexIsInRange_(index)) {
                return;
            }
            // Always scroll to 0 if scrolling to the 0th index
            if (index === 0) {
                return this.adapter.scrollTo(0);
            }
            // Always scroll to the max value if scrolling to the Nth index
            // MDCTabScroller.scrollTo() will never scroll past the max possible value
            if (index === this.adapter.getTabListLength() - 1) {
                return this.adapter.scrollTo(this.adapter.getScrollContentWidth());
            }
            if (this.isRTL_()) {
                return this.scrollIntoViewRTL_(index);
            }
            this.scrollIntoView_(index);
        };
        /**
         * Private method for determining the index of the destination tab based on what key was pressed
         * @param origin The original index from which to determine the destination
         * @param key The name of the key
         */
        MDCTabBarFoundation.prototype.determineTargetFromKey_ = function (origin, key) {
            var isRTL = this.isRTL_();
            var maxIndex = this.adapter.getTabListLength() - 1;
            var shouldGoToEnd = key === strings.END_KEY;
            var shouldDecrement = key === strings.ARROW_LEFT_KEY && !isRTL || key === strings.ARROW_RIGHT_KEY && isRTL;
            var shouldIncrement = key === strings.ARROW_RIGHT_KEY && !isRTL || key === strings.ARROW_LEFT_KEY && isRTL;
            var index = origin;
            if (shouldGoToEnd) {
                index = maxIndex;
            }
            else if (shouldDecrement) {
                index -= 1;
            }
            else if (shouldIncrement) {
                index += 1;
            }
            else {
                index = 0;
            }
            if (index < 0) {
                index = maxIndex;
            }
            else if (index > maxIndex) {
                index = 0;
            }
            return index;
        };
        /**
         * Calculates the scroll increment that will make the tab at the given index visible
         * @param index The index of the tab
         * @param nextIndex The index of the next tab
         * @param scrollPosition The current scroll position
         * @param barWidth The width of the Tab Bar
         */
        MDCTabBarFoundation.prototype.calculateScrollIncrement_ = function (index, nextIndex, scrollPosition, barWidth) {
            var nextTabDimensions = this.adapter.getTabDimensionsAtIndex(nextIndex);
            var relativeContentLeft = nextTabDimensions.contentLeft - scrollPosition - barWidth;
            var relativeContentRight = nextTabDimensions.contentRight - scrollPosition;
            var leftIncrement = relativeContentRight - numbers.EXTRA_SCROLL_AMOUNT;
            var rightIncrement = relativeContentLeft + numbers.EXTRA_SCROLL_AMOUNT;
            if (nextIndex < index) {
                return Math.min(leftIncrement, 0);
            }
            return Math.max(rightIncrement, 0);
        };
        /**
         * Calculates the scroll increment that will make the tab at the given index visible in RTL
         * @param index The index of the tab
         * @param nextIndex The index of the next tab
         * @param scrollPosition The current scroll position
         * @param barWidth The width of the Tab Bar
         * @param scrollContentWidth The width of the scroll content
         */
        MDCTabBarFoundation.prototype.calculateScrollIncrementRTL_ = function (index, nextIndex, scrollPosition, barWidth, scrollContentWidth) {
            var nextTabDimensions = this.adapter.getTabDimensionsAtIndex(nextIndex);
            var relativeContentLeft = scrollContentWidth - nextTabDimensions.contentLeft - scrollPosition;
            var relativeContentRight = scrollContentWidth - nextTabDimensions.contentRight - scrollPosition - barWidth;
            var leftIncrement = relativeContentRight + numbers.EXTRA_SCROLL_AMOUNT;
            var rightIncrement = relativeContentLeft - numbers.EXTRA_SCROLL_AMOUNT;
            if (nextIndex > index) {
                return Math.max(leftIncrement, 0);
            }
            return Math.min(rightIncrement, 0);
        };
        /**
         * Determines the index of the adjacent tab closest to either edge of the Tab Bar
         * @param index The index of the tab
         * @param tabDimensions The dimensions of the tab
         * @param scrollPosition The current scroll position
         * @param barWidth The width of the tab bar
         */
        MDCTabBarFoundation.prototype.findAdjacentTabIndexClosestToEdge_ = function (index, tabDimensions, scrollPosition, barWidth) {
            /**
             * Tabs are laid out in the Tab Scroller like this:
             *
             *    Scroll Position
             *    +---+
             *    |   |   Bar Width
             *    |   +-----------------------------------+
             *    |   |                                   |
             *    |   V                                   V
             *    |   +-----------------------------------+
             *    V   |             Tab Scroller          |
             *    +------------+--------------+-------------------+
             *    |    Tab     |      Tab     |        Tab        |
             *    +------------+--------------+-------------------+
             *        |                                   |
             *        +-----------------------------------+
             *
             * To determine the next adjacent index, we look at the Tab root left and
             * Tab root right, both relative to the scroll position. If the Tab root
             * left is less than 0, then we know it's out of view to the left. If the
             * Tab root right minus the bar width is greater than 0, we know the Tab is
             * out of view to the right. From there, we either increment or decrement
             * the index.
             */
            var relativeRootLeft = tabDimensions.rootLeft - scrollPosition;
            var relativeRootRight = tabDimensions.rootRight - scrollPosition - barWidth;
            var relativeRootDelta = relativeRootLeft + relativeRootRight;
            var leftEdgeIsCloser = relativeRootLeft < 0 || relativeRootDelta < 0;
            var rightEdgeIsCloser = relativeRootRight > 0 || relativeRootDelta > 0;
            if (leftEdgeIsCloser) {
                return index - 1;
            }
            if (rightEdgeIsCloser) {
                return index + 1;
            }
            return -1;
        };
        /**
         * Determines the index of the adjacent tab closest to either edge of the Tab Bar in RTL
         * @param index The index of the tab
         * @param tabDimensions The dimensions of the tab
         * @param scrollPosition The current scroll position
         * @param barWidth The width of the tab bar
         * @param scrollContentWidth The width of the scroller content
         */
        MDCTabBarFoundation.prototype.findAdjacentTabIndexClosestToEdgeRTL_ = function (index, tabDimensions, scrollPosition, barWidth, scrollContentWidth) {
            var rootLeft = scrollContentWidth - tabDimensions.rootLeft - barWidth - scrollPosition;
            var rootRight = scrollContentWidth - tabDimensions.rootRight - scrollPosition;
            var rootDelta = rootLeft + rootRight;
            var leftEdgeIsCloser = rootLeft > 0 || rootDelta > 0;
            var rightEdgeIsCloser = rootRight < 0 || rootDelta < 0;
            if (leftEdgeIsCloser) {
                return index + 1;
            }
            if (rightEdgeIsCloser) {
                return index - 1;
            }
            return -1;
        };
        /**
         * Returns the key associated with a keydown event
         * @param evt The keydown event
         */
        MDCTabBarFoundation.prototype.getKeyFromEvent_ = function (evt) {
            if (ACCEPTABLE_KEYS.has(evt.key)) {
                return evt.key;
            }
            return KEYCODE_MAP.get(evt.keyCode);
        };
        MDCTabBarFoundation.prototype.isActivationKey_ = function (key) {
            return key === strings.SPACE_KEY || key === strings.ENTER_KEY;
        };
        /**
         * Returns whether a given index is inclusively between the ends
         * @param index The index to test
         */
        MDCTabBarFoundation.prototype.indexIsInRange_ = function (index) {
            return index >= 0 && index < this.adapter.getTabListLength();
        };
        /**
         * Returns the view's RTL property
         */
        MDCTabBarFoundation.prototype.isRTL_ = function () {
            return this.adapter.isRTL();
        };
        /**
         * Scrolls the tab at the given index into view for left-to-right user agents.
         * @param index The index of the tab to scroll into view
         */
        MDCTabBarFoundation.prototype.scrollIntoView_ = function (index) {
            var scrollPosition = this.adapter.getScrollPosition();
            var barWidth = this.adapter.getOffsetWidth();
            var tabDimensions = this.adapter.getTabDimensionsAtIndex(index);
            var nextIndex = this.findAdjacentTabIndexClosestToEdge_(index, tabDimensions, scrollPosition, barWidth);
            if (!this.indexIsInRange_(nextIndex)) {
                return;
            }
            var scrollIncrement = this.calculateScrollIncrement_(index, nextIndex, scrollPosition, barWidth);
            this.adapter.incrementScroll(scrollIncrement);
        };
        /**
         * Scrolls the tab at the given index into view in RTL
         * @param index The tab index to make visible
         */
        MDCTabBarFoundation.prototype.scrollIntoViewRTL_ = function (index) {
            var scrollPosition = this.adapter.getScrollPosition();
            var barWidth = this.adapter.getOffsetWidth();
            var tabDimensions = this.adapter.getTabDimensionsAtIndex(index);
            var scrollWidth = this.adapter.getScrollContentWidth();
            var nextIndex = this.findAdjacentTabIndexClosestToEdgeRTL_(index, tabDimensions, scrollPosition, barWidth, scrollWidth);
            if (!this.indexIsInRange_(nextIndex)) {
                return;
            }
            var scrollIncrement = this.calculateScrollIncrementRTL_(index, nextIndex, scrollPosition, barWidth, scrollWidth);
            this.adapter.incrementScroll(scrollIncrement);
        };
        return MDCTabBarFoundation;
    }(MDCFoundation));

    /* node_modules/@smui/tab-scroller/TabScroller.svelte generated by Svelte v3.37.0 */

    const file$5 = "node_modules/@smui/tab-scroller/TabScroller.svelte";

    function create_fragment$5(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let div0_class_value;
    	let div0_style_value;
    	let useActions_action;
    	let div1_class_value;
    	let div1_style_value;
    	let useActions_action_1;
    	let div2_class_value;
    	let useActions_action_2;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[23].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[22], null);

    	let div0_levels = [
    		{
    			class: div0_class_value = classMap({
    				[/*scrollContent$class*/ ctx[6]]: true,
    				"mdc-tab-scroller__scroll-content": true
    			})
    		},
    		{
    			style: div0_style_value = Object.entries(/*scrollContentStyles*/ ctx[14]).map(func).join(" ")
    		},
    		prefixFilter(/*$$restProps*/ ctx[16], "scrollContent$")
    	];

    	let div0_data = {};

    	for (let i = 0; i < div0_levels.length; i += 1) {
    		div0_data = assign(div0_data, div0_levels[i]);
    	}

    	let div1_levels = [
    		{
    			class: div1_class_value = classMap({
    				[/*scrollArea$class*/ ctx[4]]: true,
    				"mdc-tab-scroller__scroll-area": true,
    				.../*scrollAreaClasses*/ ctx[12]
    			})
    		},
    		{
    			style: div1_style_value = Object.entries(/*scrollAreaStyles*/ ctx[13]).map(func_1).join(" ")
    		},
    		prefixFilter(/*$$restProps*/ ctx[16], "scrollArea$")
    	];

    	let div1_data = {};

    	for (let i = 0; i < div1_levels.length; i += 1) {
    		div1_data = assign(div1_data, div1_levels[i]);
    	}

    	let div2_levels = [
    		{
    			class: div2_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				"mdc-tab-scroller": true,
    				"mdc-tab-scroller--align-start": /*align*/ ctx[2] === "start",
    				"mdc-tab-scroller--align-end": /*align*/ ctx[2] === "end",
    				"mdc-tab-scroller--align-center": /*align*/ ctx[2] === "center",
    				.../*internalClasses*/ ctx[11]
    			})
    		},
    		exclude(/*$$restProps*/ ctx[16], ["scrollArea$", "scrollContent$"])
    	];

    	let div2_data = {};

    	for (let i = 0; i < div2_levels.length; i += 1) {
    		div2_data = assign(div2_data, div2_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div0, div0_data);
    			add_location(div0, file$5, 32, 4, 1108);
    			set_attributes(div1, div1_data);
    			add_location(div1, file$5, 14, 2, 406);
    			set_attributes(div2, div2_data);
    			add_location(div2, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div0_binding*/ ctx[24](div0);
    			/*div1_binding*/ ctx[26](div1);
    			/*div2_binding*/ ctx[32](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div0, /*scrollContent$use*/ ctx[5])),
    					listen_dev(div0, "transitionend", /*transitionend_handler*/ ctx[25], false, false, false),
    					action_destroyer(useActions_action_1 = useActions.call(null, div1, /*scrollArea$use*/ ctx[3])),
    					listen_dev(div1, "wheel", /*wheel_handler*/ ctx[27], { passive: true }, false, false),
    					listen_dev(div1, "touchstart", /*touchstart_handler*/ ctx[28], { passive: true }, false, false),
    					listen_dev(div1, "pointerdown", /*pointerdown_handler*/ ctx[29], false, false, false),
    					listen_dev(div1, "mousedown", /*mousedown_handler*/ ctx[30], false, false, false),
    					listen_dev(div1, "keydown", /*keydown_handler*/ ctx[31], false, false, false),
    					action_destroyer(useActions_action_2 = useActions.call(null, div2, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[15].call(null, div2))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 4194304) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[22], dirty, null, null);
    				}
    			}

    			set_attributes(div0, div0_data = get_spread_update(div0_levels, [
    				(!current || dirty[0] & /*scrollContent$class*/ 64 && div0_class_value !== (div0_class_value = classMap({
    					[/*scrollContent$class*/ ctx[6]]: true,
    					"mdc-tab-scroller__scroll-content": true
    				}))) && { class: div0_class_value },
    				(!current || dirty[0] & /*scrollContentStyles*/ 16384 && div0_style_value !== (div0_style_value = Object.entries(/*scrollContentStyles*/ ctx[14]).map(func).join(" "))) && { style: div0_style_value },
    				dirty[0] & /*$$restProps*/ 65536 && prefixFilter(/*$$restProps*/ ctx[16], "scrollContent$")
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*scrollContent$use*/ 32) useActions_action.update.call(null, /*scrollContent$use*/ ctx[5]);

    			set_attributes(div1, div1_data = get_spread_update(div1_levels, [
    				(!current || dirty[0] & /*scrollArea$class, scrollAreaClasses*/ 4112 && div1_class_value !== (div1_class_value = classMap({
    					[/*scrollArea$class*/ ctx[4]]: true,
    					"mdc-tab-scroller__scroll-area": true,
    					.../*scrollAreaClasses*/ ctx[12]
    				}))) && { class: div1_class_value },
    				(!current || dirty[0] & /*scrollAreaStyles*/ 8192 && div1_style_value !== (div1_style_value = Object.entries(/*scrollAreaStyles*/ ctx[13]).map(func_1).join(" "))) && { style: div1_style_value },
    				dirty[0] & /*$$restProps*/ 65536 && prefixFilter(/*$$restProps*/ ctx[16], "scrollArea$")
    			]));

    			if (useActions_action_1 && is_function(useActions_action_1.update) && dirty[0] & /*scrollArea$use*/ 8) useActions_action_1.update.call(null, /*scrollArea$use*/ ctx[3]);

    			set_attributes(div2, div2_data = get_spread_update(div2_levels, [
    				(!current || dirty[0] & /*className, align, internalClasses*/ 2054 && div2_class_value !== (div2_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					"mdc-tab-scroller": true,
    					"mdc-tab-scroller--align-start": /*align*/ ctx[2] === "start",
    					"mdc-tab-scroller--align-end": /*align*/ ctx[2] === "end",
    					"mdc-tab-scroller--align-center": /*align*/ ctx[2] === "center",
    					.../*internalClasses*/ ctx[11]
    				}))) && { class: div2_class_value },
    				dirty[0] & /*$$restProps*/ 65536 && exclude(/*$$restProps*/ ctx[16], ["scrollArea$", "scrollContent$"])
    			]));

    			if (useActions_action_2 && is_function(useActions_action_2.update) && dirty[0] & /*use*/ 1) useActions_action_2.update.call(null, /*use*/ ctx[0]);
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
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			/*div0_binding*/ ctx[24](null);
    			/*div1_binding*/ ctx[26](null);
    			/*div2_binding*/ ctx[32](null);
    			mounted = false;
    			run_all(dispose);
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

    const func = ([name, value]) => `${name}: ${value};`;
    const func_1 = ([name, value]) => `${name}: ${value};`;

    function instance_1$1($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","align","scrollArea$use","scrollArea$class","scrollContent$use","scrollContent$class","getScrollPosition","getScrollContentWidth","incrementScroll","scrollTo","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TabScroller", slots, ['default']);
    	const { matches } = ponyfill;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = "" } = $$props;
    	let { align = null } = $$props;
    	let { scrollArea$use = [] } = $$props;
    	let { scrollArea$class = "" } = $$props;
    	let { scrollContent$use = [] } = $$props;
    	let { scrollContent$class = "" } = $$props;
    	let element;
    	let instance;
    	let scrollArea;
    	let scrollContent;
    	let internalClasses = {};
    	let scrollAreaClasses = {};
    	let scrollAreaStyles = {};
    	let scrollContentStyles = {};

    	onMount(() => {
    		$$invalidate(8, instance = new MDCTabScrollerFoundation({
    				eventTargetMatchesSelector: (evtTarget, selector) => matches(evtTarget, selector),
    				addClass,
    				removeClass,
    				addScrollAreaClass,
    				setScrollAreaStyleProperty: addScrollAreaStyle,
    				setScrollContentStyleProperty: addScrollContentStyle,
    				getScrollContentStyleValue: getScrollContentStyle,
    				setScrollAreaScrollLeft: scrollX => $$invalidate(9, scrollArea.scrollLeft = scrollX, scrollArea),
    				getScrollAreaScrollLeft: () => scrollArea.scrollLeft,
    				getScrollContentOffsetWidth: () => scrollContent.offsetWidth,
    				getScrollAreaOffsetWidth: () => scrollArea.offsetWidth,
    				computeScrollAreaClientRect: () => scrollArea.getBoundingClientRect(),
    				computeScrollContentClientRect: () => scrollContent.getBoundingClientRect(),
    				computeHorizontalScrollbarHeight: () => computeHorizontalScrollbarHeight(document)
    			}));

    		instance.init();

    		return () => {
    			instance.destroy();
    		};
    	});

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(11, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(11, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addScrollAreaClass(className) {
    		if (!scrollAreaClasses[className]) {
    			$$invalidate(12, scrollAreaClasses[className] = true, scrollAreaClasses);
    		}
    	}

    	function addScrollAreaStyle(name, value) {
    		if (scrollAreaStyles[name] != value) {
    			if (value === "" || value == null) {
    				delete scrollAreaStyles[name];
    				$$invalidate(13, scrollAreaStyles);
    			} else {
    				$$invalidate(13, scrollAreaStyles[name] = value, scrollAreaStyles);
    			}
    		}
    	}

    	function addScrollContentStyle(name, value) {
    		if (scrollContentStyles[name] != value) {
    			if (value === "" || value == null) {
    				delete scrollContentStyles[name];
    				$$invalidate(14, scrollContentStyles);
    			} else {
    				$$invalidate(14, scrollContentStyles[name] = value, scrollContentStyles);
    			}
    		}
    	}

    	function getScrollContentStyle(name) {
    		return name in scrollContentStyles
    		? scrollContentStyles[name]
    		: getComputedStyle(scrollContent).getPropertyValue(name);
    	}

    	function getScrollPosition() {
    		return instance.getScrollPosition();
    	}

    	function getScrollContentWidth() {
    		return scrollContent.offsetWidth;
    	}

    	function incrementScroll(scrollXIncrement) {
    		instance.incrementScroll(scrollXIncrement);
    	}

    	function scrollTo(scrollX) {
    		instance.scrollTo(scrollX);
    	}

    	function getElement() {
    		return element;
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			scrollContent = $$value;
    			$$invalidate(10, scrollContent);
    		});
    	}

    	const transitionend_handler = event => instance && instance.handleTransitionEnd(event);

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			scrollArea = $$value;
    			$$invalidate(9, scrollArea);
    		});
    	}

    	const wheel_handler = () => instance && instance.handleInteraction();
    	const touchstart_handler = () => instance && instance.handleInteraction();
    	const pointerdown_handler = () => instance && instance.handleInteraction();
    	const mousedown_handler = () => instance && instance.handleInteraction();
    	const keydown_handler = () => instance && instance.handleInteraction();

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			element = $$value;
    			$$invalidate(7, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(16, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("use" in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ("class" in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ("align" in $$new_props) $$invalidate(2, align = $$new_props.align);
    		if ("scrollArea$use" in $$new_props) $$invalidate(3, scrollArea$use = $$new_props.scrollArea$use);
    		if ("scrollArea$class" in $$new_props) $$invalidate(4, scrollArea$class = $$new_props.scrollArea$class);
    		if ("scrollContent$use" in $$new_props) $$invalidate(5, scrollContent$use = $$new_props.scrollContent$use);
    		if ("scrollContent$class" in $$new_props) $$invalidate(6, scrollContent$class = $$new_props.scrollContent$class);
    		if ("$$scope" in $$new_props) $$invalidate(22, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCTabScrollerFoundation,
    		util,
    		ponyfill,
    		onMount,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		matches,
    		forwardEvents,
    		use,
    		className,
    		align,
    		scrollArea$use,
    		scrollArea$class,
    		scrollContent$use,
    		scrollContent$class,
    		element,
    		instance,
    		scrollArea,
    		scrollContent,
    		internalClasses,
    		scrollAreaClasses,
    		scrollAreaStyles,
    		scrollContentStyles,
    		addClass,
    		removeClass,
    		addScrollAreaClass,
    		addScrollAreaStyle,
    		addScrollContentStyle,
    		getScrollContentStyle,
    		getScrollPosition,
    		getScrollContentWidth,
    		incrementScroll,
    		scrollTo,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("use" in $$props) $$invalidate(0, use = $$new_props.use);
    		if ("className" in $$props) $$invalidate(1, className = $$new_props.className);
    		if ("align" in $$props) $$invalidate(2, align = $$new_props.align);
    		if ("scrollArea$use" in $$props) $$invalidate(3, scrollArea$use = $$new_props.scrollArea$use);
    		if ("scrollArea$class" in $$props) $$invalidate(4, scrollArea$class = $$new_props.scrollArea$class);
    		if ("scrollContent$use" in $$props) $$invalidate(5, scrollContent$use = $$new_props.scrollContent$use);
    		if ("scrollContent$class" in $$props) $$invalidate(6, scrollContent$class = $$new_props.scrollContent$class);
    		if ("element" in $$props) $$invalidate(7, element = $$new_props.element);
    		if ("instance" in $$props) $$invalidate(8, instance = $$new_props.instance);
    		if ("scrollArea" in $$props) $$invalidate(9, scrollArea = $$new_props.scrollArea);
    		if ("scrollContent" in $$props) $$invalidate(10, scrollContent = $$new_props.scrollContent);
    		if ("internalClasses" in $$props) $$invalidate(11, internalClasses = $$new_props.internalClasses);
    		if ("scrollAreaClasses" in $$props) $$invalidate(12, scrollAreaClasses = $$new_props.scrollAreaClasses);
    		if ("scrollAreaStyles" in $$props) $$invalidate(13, scrollAreaStyles = $$new_props.scrollAreaStyles);
    		if ("scrollContentStyles" in $$props) $$invalidate(14, scrollContentStyles = $$new_props.scrollContentStyles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		align,
    		scrollArea$use,
    		scrollArea$class,
    		scrollContent$use,
    		scrollContent$class,
    		element,
    		instance,
    		scrollArea,
    		scrollContent,
    		internalClasses,
    		scrollAreaClasses,
    		scrollAreaStyles,
    		scrollContentStyles,
    		forwardEvents,
    		$$restProps,
    		getScrollPosition,
    		getScrollContentWidth,
    		incrementScroll,
    		scrollTo,
    		getElement,
    		$$scope,
    		slots,
    		div0_binding,
    		transitionend_handler,
    		div1_binding,
    		wheel_handler,
    		touchstart_handler,
    		pointerdown_handler,
    		mousedown_handler,
    		keydown_handler,
    		div2_binding
    	];
    }

    class TabScroller extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1$1,
    			create_fragment$5,
    			safe_not_equal,
    			{
    				use: 0,
    				class: 1,
    				align: 2,
    				scrollArea$use: 3,
    				scrollArea$class: 4,
    				scrollContent$use: 5,
    				scrollContent$class: 6,
    				getScrollPosition: 17,
    				getScrollContentWidth: 18,
    				incrementScroll: 19,
    				scrollTo: 20,
    				getElement: 21
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabScroller",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get use() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollArea$use() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollArea$use(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollArea$class() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollArea$class(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollContent$use() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollContent$use(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollContent$class() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollContent$class(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getScrollPosition() {
    		return this.$$.ctx[17];
    	}

    	set getScrollPosition(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getScrollContentWidth() {
    		return this.$$.ctx[18];
    	}

    	set getScrollContentWidth(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get incrementScroll() {
    		return this.$$.ctx[19];
    	}

    	set incrementScroll(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollTo() {
    		return this.$$.ctx[20];
    	}

    	set scrollTo(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[21];
    	}

    	set getElement(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/tab-bar/TabBar.svelte generated by Svelte v3.37.0 */
    const file$4 = "node_modules/@smui/tab-bar/TabBar.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[34] = i;
    	return child_ctx;
    }

    const get_default_slot_changes = dirty => ({ tab: dirty[0] & /*tabs*/ 4 });
    const get_default_slot_context = ctx => ({ tab: /*tab*/ ctx[32] });

    // (21:4) {#each tabs as tab, i (key(tab))}
    function create_each_block$1(key_2, ctx) {
    	let first;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[27], get_default_slot_context);

    	const block = {
    		key: key_2,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (default_slot) default_slot.c();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope, tabs*/ 134217732) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[27], dirty, get_default_slot_changes, get_default_slot_context);
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
    			if (detaching) detach_dev(first);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(21:4) {#each tabs as tab, i (key(tab))}",
    		ctx
    	});

    	return block;
    }

    // (17:2) <TabScroller     bind:this={tabScroller}     {...prefixFilter($$restProps, 'tabScroller$')}   >
    function create_default_slot$1(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*tabs*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*key*/ ctx[3](/*tab*/ ctx[32]);
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
    			if (dirty[0] & /*$$scope, tabs, key*/ 134217740) {
    				each_value = /*tabs*/ ctx[2];
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
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(17:2) <TabScroller     bind:this={tabScroller}     {...prefixFilter($$restProps, 'tabScroller$')}   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let tabscroller;
    	let div_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const tabscroller_spread_levels = [prefixFilter(/*$$restProps*/ ctx[10], "tabScroller$")];

    	let tabscroller_props = {
    		$$slots: { default: [create_default_slot$1] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < tabscroller_spread_levels.length; i += 1) {
    		tabscroller_props = assign(tabscroller_props, tabscroller_spread_levels[i]);
    	}

    	tabscroller = new TabScroller({ props: tabscroller_props, $$inline: true });
    	/*tabscroller_binding*/ ctx[21](tabscroller);

    	let div_levels = [
    		{
    			class: div_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				"mdc-tab-bar": true
    			})
    		},
    		{ role: "tablist" },
    		exclude(/*$$restProps*/ ctx[10], ["tabScroller$"])
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(tabscroller.$$.fragment);
    			set_attributes(div, div_data);
    			add_location(div, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(tabscroller, div, null);
    			/*div_binding*/ ctx[22](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[7].call(null, div)),
    					listen_dev(div, "SMUI:tab:mount", /*SMUI_tab_mount_handler*/ ctx[23], false, false, false),
    					listen_dev(div, "SMUI:tab:unmount", /*SMUI_tab_unmount_handler*/ ctx[24], false, false, false),
    					listen_dev(div, "keydown", /*keydown_handler*/ ctx[25], false, false, false),
    					listen_dev(div, "MDCTab:interacted", /*MDCTab_interacted_handler*/ ctx[26], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const tabscroller_changes = (dirty[0] & /*$$restProps*/ 1024)
    			? get_spread_update(tabscroller_spread_levels, [get_spread_object(prefixFilter(/*$$restProps*/ ctx[10], "tabScroller$"))])
    			: {};

    			if (dirty[0] & /*$$scope, tabs*/ 134217732) {
    				tabscroller_changes.$$scope = { dirty, ctx };
    			}

    			tabscroller.$set(tabscroller_changes);

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty[0] & /*className*/ 2 && div_class_value !== (div_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					"mdc-tab-bar": true
    				}))) && { class: div_class_value },
    				{ role: "tablist" },
    				dirty[0] & /*$$restProps*/ 1024 && exclude(/*$$restProps*/ ctx[10], ["tabScroller$"])
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabscroller.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabscroller.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*tabscroller_binding*/ ctx[21](null);
    			destroy_component(tabscroller);
    			/*div_binding*/ ctx[22](null);
    			mounted = false;
    			run_all(dispose);
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

    function instance_1($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","tabs","key","focusOnActivate","focusOnProgrammatic","useAutomaticActivation","active","scrollIntoView","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TabBar", slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = "" } = $$props;
    	let { tabs = [] } = $$props;
    	let { key = tab => tab } = $$props;
    	let { focusOnActivate = true } = $$props;
    	let { focusOnProgrammatic = false } = $$props;
    	let { useAutomaticActivation = true } = $$props;
    	let { active = null } = $$props;
    	let element;
    	let instance;
    	let tabScroller;
    	let activeIndex = tabs.indexOf(active);
    	let tabAccessorMap = {};
    	let tabAccessorWeakMap = new WeakMap();
    	let skipFocus = false;
    	setContext("SMUI:tab:focusOnActivate", focusOnActivate);
    	setContext("SMUI:tab:initialActive", active);

    	onMount(() => {
    		$$invalidate(4, instance = new MDCTabBarFoundation({
    				scrollTo: scrollX => tabScroller.scrollTo(scrollX),
    				incrementScroll: scrollXIncrement => tabScroller.incrementScroll(scrollXIncrement),
    				getScrollPosition: () => tabScroller.getScrollPosition(),
    				getScrollContentWidth: () => tabScroller.getScrollContentWidth(),
    				getOffsetWidth: () => getElement().offsetWidth,
    				isRTL: () => getComputedStyle(getElement()).getPropertyValue("direction") === "rtl",
    				setActiveTab: index => {
    					$$invalidate(11, active = tabs[index]);
    					$$invalidate(17, activeIndex = index);
    					instance.activateTab(index);
    				},
    				activateTabAtIndex: (index, clientRect) => getAccessor(tabs[index]).activate(clientRect, skipFocus),
    				deactivateTabAtIndex: index => getAccessor(tabs[index]).deactivate(),
    				focusTabAtIndex: index => getAccessor(tabs[index]).focus(),
    				getTabIndicatorClientRectAtIndex: index => getAccessor(tabs[index]).computeIndicatorClientRect(),
    				getTabDimensionsAtIndex: index => getAccessor(tabs[index]).computeDimensions(),
    				getPreviousActiveTabIndex: () => {
    					for (let i = 0; i < tabs.length; i++) {
    						if (getAccessor(tabs[i]).active) {
    							return i;
    						}
    					}

    					return -1;
    				},
    				getFocusedTabIndex: () => {
    					const tabElements = tabs.map(tab => getAccessor(tab).element);
    					const activeElement = document.activeElement;
    					return tabElements.indexOf(activeElement);
    				},
    				getIndexOfTabById: id => tabs.indexOf(id),
    				getTabListLength: () => tabs.length,
    				notifyTabActivated: index => dispatch(getElement(), "MDCTabBar:activated", { index })
    			}));

    		instance.init();

    		return () => {
    			instance.destroy();
    		};
    	});

    	function handleTabMount(event) {
    		const accessor = event.detail;
    		addAccessor(accessor.tabId, accessor);
    	}

    	function handleTabUnmount(event) {
    		const accessor = event.detail;
    		removeAccessor(accessor.tabId);
    	}

    	function getAccessor(tabId) {
    		return tabId instanceof Object
    		? tabAccessorWeakMap.get(tabId)
    		: tabAccessorMap[tabId];
    	}

    	function addAccessor(tabId, accessor) {
    		if (tabId instanceof Object) {
    			tabAccessorWeakMap.set(tabId, accessor);
    			$$invalidate(19, tabAccessorWeakMap);
    		} else {
    			$$invalidate(18, tabAccessorMap[tabId] = accessor, tabAccessorMap);
    			$$invalidate(18, tabAccessorMap);
    		}
    	}

    	function removeAccessor(tabId) {
    		if (tabId instanceof Object) {
    			tabAccessorWeakMap.delete(tabId);
    			$$invalidate(19, tabAccessorWeakMap);
    		} else {
    			delete tabAccessorMap[tabId];
    			$$invalidate(18, tabAccessorMap);
    		}
    	}

    	function scrollIntoView(index) {
    		instance.scrollIntoView(index);
    	}

    	function getElement() {
    		return element;
    	}

    	function tabscroller_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			tabScroller = $$value;
    			$$invalidate(6, tabScroller);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			element = $$value;
    			$$invalidate(5, element);
    		});
    	}

    	const SMUI_tab_mount_handler = event => handleTabMount(event);
    	const SMUI_tab_unmount_handler = event => handleTabUnmount(event);
    	const keydown_handler = event => instance && instance.handleKeyDown(event);
    	const MDCTab_interacted_handler = event => instance && instance.handleTabInteraction(event);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("use" in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ("class" in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ("tabs" in $$new_props) $$invalidate(2, tabs = $$new_props.tabs);
    		if ("key" in $$new_props) $$invalidate(3, key = $$new_props.key);
    		if ("focusOnActivate" in $$new_props) $$invalidate(12, focusOnActivate = $$new_props.focusOnActivate);
    		if ("focusOnProgrammatic" in $$new_props) $$invalidate(13, focusOnProgrammatic = $$new_props.focusOnProgrammatic);
    		if ("useAutomaticActivation" in $$new_props) $$invalidate(14, useAutomaticActivation = $$new_props.useAutomaticActivation);
    		if ("active" in $$new_props) $$invalidate(11, active = $$new_props.active);
    		if ("$$scope" in $$new_props) $$invalidate(27, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCTabBarFoundation,
    		onMount,
    		setContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		dispatch,
    		TabScroller,
    		forwardEvents,
    		use,
    		className,
    		tabs,
    		key,
    		focusOnActivate,
    		focusOnProgrammatic,
    		useAutomaticActivation,
    		active,
    		element,
    		instance,
    		tabScroller,
    		activeIndex,
    		tabAccessorMap,
    		tabAccessorWeakMap,
    		skipFocus,
    		handleTabMount,
    		handleTabUnmount,
    		getAccessor,
    		addAccessor,
    		removeAccessor,
    		scrollIntoView,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("use" in $$props) $$invalidate(0, use = $$new_props.use);
    		if ("className" in $$props) $$invalidate(1, className = $$new_props.className);
    		if ("tabs" in $$props) $$invalidate(2, tabs = $$new_props.tabs);
    		if ("key" in $$props) $$invalidate(3, key = $$new_props.key);
    		if ("focusOnActivate" in $$props) $$invalidate(12, focusOnActivate = $$new_props.focusOnActivate);
    		if ("focusOnProgrammatic" in $$props) $$invalidate(13, focusOnProgrammatic = $$new_props.focusOnProgrammatic);
    		if ("useAutomaticActivation" in $$props) $$invalidate(14, useAutomaticActivation = $$new_props.useAutomaticActivation);
    		if ("active" in $$props) $$invalidate(11, active = $$new_props.active);
    		if ("element" in $$props) $$invalidate(5, element = $$new_props.element);
    		if ("instance" in $$props) $$invalidate(4, instance = $$new_props.instance);
    		if ("tabScroller" in $$props) $$invalidate(6, tabScroller = $$new_props.tabScroller);
    		if ("activeIndex" in $$props) $$invalidate(17, activeIndex = $$new_props.activeIndex);
    		if ("tabAccessorMap" in $$props) $$invalidate(18, tabAccessorMap = $$new_props.tabAccessorMap);
    		if ("tabAccessorWeakMap" in $$props) $$invalidate(19, tabAccessorWeakMap = $$new_props.tabAccessorWeakMap);
    		if ("skipFocus" in $$props) skipFocus = $$new_props.skipFocus;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*active, tabs, activeIndex, instance, focusOnProgrammatic*/ 141332) {
    			if (active !== tabs[activeIndex]) {
    				$$invalidate(17, activeIndex = tabs.indexOf(active));

    				if (instance) {
    					skipFocus = !focusOnProgrammatic;
    					instance.activateTab(activeIndex);
    					skipFocus = false;
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tabs, tabAccessorWeakMap, tabAccessorMap, activeIndex*/ 917508) {
    			if (tabs.length) {
    				// Manually get the accessor so it is reactive.
    				const accessor = tabs[0] instanceof Object
    				? tabAccessorWeakMap.get(tabs[0])
    				: tabAccessorMap[tabs[0]];

    				if (accessor) {
    					accessor.forceAccessible(activeIndex === -1);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*instance, useAutomaticActivation*/ 16400) {
    			if (instance) {
    				instance.setUseAutomaticActivation(useAutomaticActivation);
    			}
    		}
    	};

    	return [
    		use,
    		className,
    		tabs,
    		key,
    		instance,
    		element,
    		tabScroller,
    		forwardEvents,
    		handleTabMount,
    		handleTabUnmount,
    		$$restProps,
    		active,
    		focusOnActivate,
    		focusOnProgrammatic,
    		useAutomaticActivation,
    		scrollIntoView,
    		getElement,
    		activeIndex,
    		tabAccessorMap,
    		tabAccessorWeakMap,
    		slots,
    		tabscroller_binding,
    		div_binding,
    		SMUI_tab_mount_handler,
    		SMUI_tab_unmount_handler,
    		keydown_handler,
    		MDCTab_interacted_handler,
    		$$scope
    	];
    }

    class TabBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1,
    			create_fragment$4,
    			safe_not_equal,
    			{
    				use: 0,
    				class: 1,
    				tabs: 2,
    				key: 3,
    				focusOnActivate: 12,
    				focusOnProgrammatic: 13,
    				useAutomaticActivation: 14,
    				active: 11,
    				scrollIntoView: 15,
    				getElement: 16
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabBar",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get use() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabs() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabs(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusOnActivate() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusOnActivate(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusOnProgrammatic() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusOnProgrammatic(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get useAutomaticActivation() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set useAutomaticActivation(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollIntoView() {
    		return this.$$.ctx[15];
    	}

    	set scrollIntoView(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[16];
    	}

    	set getElement(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/FloatWindow.svelte generated by Svelte v3.37.0 */
    const file$3 = "src/FloatWindow.svelte";

    // (126:0) {#if use_smoke }
    function create_if_block$2(ctx) {
    	let div;
    	let t;
    	let div_id_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text("...");
    			attr_dev(div, "id", div_id_value = "smoke_" + /*index*/ ctx[2]);
    			attr_dev(div, "class", "smoke svelte-6mxcwp");
    			add_location(div, file$3, 126, 0, 3313);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*index*/ 4 && div_id_value !== (div_id_value = "smoke_" + /*index*/ ctx[2])) {
    				attr_dev(div, "id", div_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(126:0) {#if use_smoke }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let t0;
    	let div1;
    	let div0;
    	let t1;
    	let t2;
    	let span;
    	let t3;
    	let span_id_value;
    	let div0_id_value;
    	let t4;
    	let p;
    	let t6;
    	let div1_id_value;
    	let current;
    	let if_block = /*use_smoke*/ ctx[1] && create_if_block$2(ctx);
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t1 = text(/*title*/ ctx[0]);
    			t2 = space();
    			span = element("span");
    			t3 = text("[X]");
    			t4 = space();
    			p = element("p");
    			p.textContent = "Press ESC to close window.";
    			t6 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(span, "id", span_id_value = "btn_close_" + /*index*/ ctx[2]);
    			attr_dev(span, "class", "btn_close svelte-6mxcwp");
    			add_location(span, file$3, 131, 3, 3471);
    			attr_dev(div0, "id", div0_id_value = "popup_bar_" + /*index*/ ctx[2]);
    			attr_dev(div0, "class", "popup_bar svelte-6mxcwp");
    			add_location(div0, file$3, 129, 1, 3409);
    			set_style(p, "font-size", "0.75em");
    			set_style(p, "font-weight", "bold");
    			set_style(p, "color", "darkgreen");
    			set_style(p, "padding-left", "4px");
    			add_location(p, file$3, 133, 2, 3540);
    			attr_dev(div1, "id", div1_id_value = "popup_" + /*index*/ ctx[2]);
    			attr_dev(div1, "class", "popup svelte-6mxcwp");
    			add_location(div1, file$3, 128, 0, 3367);
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
    			append_dev(span, t3);
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
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*title*/ 1) set_data_dev(t1, /*title*/ ctx[0]);

    			if (!current || dirty & /*index*/ 4 && span_id_value !== (span_id_value = "btn_close_" + /*index*/ ctx[2])) {
    				attr_dev(span, "id", span_id_value);
    			}

    			if (!current || dirty & /*index*/ 4 && div0_id_value !== (div0_id_value = "popup_bar_" + /*index*/ ctx[2])) {
    				attr_dev(div0, "id", div0_id_value);
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*index*/ 4 && div1_id_value !== (div1_id_value = "popup_" + /*index*/ ctx[2])) {
    				attr_dev(div1, "id", div1_id_value);
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function fix_height(ii, startup_delta) {
    	let txt_area = document.getElementById("blg-window-full-text");

    	if (txt_area) {
    		//
    		txt_area._blg_app_resized = true;

    		//
    		let r = txt_area.getBoundingClientRect();

    		//
    		var popup = document.getElementById(`popup_${ii}`);

    		if (popup) {
    			let rp = popup.getBoundingClientRect();
    			let h = Math.floor(rp.bottom - r.top) - startup_delta;
    			txt_area.style.height = h + "px";
    		}
    	}
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("FloatWindow", slots, ['default']);
    	let { title } = $$props;
    	let { scale_size } = $$props;
    	let { use_smoke = true } = $$props;
    	let { index = 0 } = $$props;
    	var SCROLL_WIDTH = 24;

    	// 
    	//-- let the popup make draggable & movable.
    	var offset = { x: 0, y: 0 };

    	onMount(() => {
    		//
    		document.getElementById(`popup_${index}`);

    		var popup_bar = document.getElementById(`popup_bar_${index}`);
    		var btn_close = document.getElementById(`btn_close_${index}`);
    		var smoke = document.getElementById(`smoke_${index}`);

    		//
    		popup_bar.addEventListener("mousedown", mouseDown, false);

    		window.addEventListener("mouseup", mouseUp, false);

    		window.onkeydown = e => {
    			if (e.keyCode == 27) {
    				// if ESC key pressed
    				document.getElementById(`btn_close_${index}`);

    				//btn_close.click(e);
    				var popup = document.getElementById(`popup_${index}`);

    				popup.style.display = "none";
    				if (smoke) smoke.style.display = "none";
    			}
    		};

    		btn_close.onclick = e => {
    			var popup = document.getElementById(`popup_${index}`);
    			popup.style.display = "none";
    			if (smoke) smoke.style.display = "none";
    		};

    		window.addEventListener("resize", e => {
    			spreadSmoke(use_smoke);
    		});

    		window.start_floating_window = index => {
    			popup_starter(index);
    		};
    	});

    	function popup_starter(ii) {
    		spreadSmoke(use_smoke);
    		var popup = document.getElementById(`popup_${ii}`);

    		if (popup.style.display !== "block") {
    			popup.style.top = "4px";
    			popup.style.left = "4px";
    			popup.style.width = window.innerWidth * scale_size.w - SCROLL_WIDTH + "px";
    			popup.style.height = window.innerHeight * scale_size.h - SCROLL_WIDTH + "px";
    			popup.style.display = "block";

    			setTimeout(
    				() => {
    					fix_height(ii, 4);
    				},
    				40
    			);
    		}

    		setTimeout(
    			() => {
    				fix_height(ii, 4);
    			},
    			20
    		);
    	}

    	function mouseUp() {
    		window.removeEventListener("mousemove", popupMove, true);
    	}

    	function mouseDown(e) {
    		var popup = document.getElementById(`popup_${index}`);
    		offset.x = e.clientX - popup.offsetLeft;
    		offset.y = e.clientY - popup.offsetTop;
    		window.addEventListener("mousemove", popupMove, true);
    	}

    	function popupMove(e) {
    		var popup = document.getElementById(`popup_${index}`);
    		popup.style.position = "absolute";
    		var top = e.clientY - offset.y;
    		var left = e.clientX - offset.x;
    		popup.style.top = top + "px";
    		popup.style.left = left + "px";
    	}

    	//-- / let the popup make draggable & movable.
    	function spreadSmoke(flg) {
    		if (flg) {
    			var smoke = document.getElementById(`smoke_${index}`);

    			if (smoke) {
    				if (smoke) smoke.style.width = window.outerWidth + 100 + "px";
    				if (smoke) smoke.style.height = window.outerHeight + 100 + "px";
    				if (smoke && flg != undefined && flg == true) smoke.style.display = "block";
    			}
    		}
    	}

    	const writable_props = ["title", "scale_size", "use_smoke", "index"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FloatWindow> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("scale_size" in $$props) $$invalidate(3, scale_size = $$props.scale_size);
    		if ("use_smoke" in $$props) $$invalidate(1, use_smoke = $$props.use_smoke);
    		if ("index" in $$props) $$invalidate(2, index = $$props.index);
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		scale_size,
    		use_smoke,
    		index,
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
    		if ("scale_size" in $$props) $$invalidate(3, scale_size = $$props.scale_size);
    		if ("use_smoke" in $$props) $$invalidate(1, use_smoke = $$props.use_smoke);
    		if ("index" in $$props) $$invalidate(2, index = $$props.index);
    		if ("SCROLL_WIDTH" in $$props) SCROLL_WIDTH = $$props.SCROLL_WIDTH;
    		if ("offset" in $$props) offset = $$props.offset;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, use_smoke, index, scale_size, $$scope, slots];
    }

    class FloatWindow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			title: 0,
    			scale_size: 3,
    			use_smoke: 1,
    			index: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FloatWindow",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<FloatWindow> was created without expected prop 'title'");
    		}

    		if (/*scale_size*/ ctx[3] === undefined && !("scale_size" in props)) {
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

    	get index() {
    		throw new Error("<FloatWindow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<FloatWindow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/MessageDisplay.svelte generated by Svelte v3.37.0 */

    const file$2 = "src/MessageDisplay.svelte";

    function create_fragment$2(ctx) {
    	let div6;
    	let div4;
    	let span0;
    	let t0;
    	let t1;
    	let h4;
    	let t2;
    	let t3;
    	let div1;
    	let div0;
    	let t4;
    	let t5;
    	let t6_value = (/*business*/ ctx[5] ? "business" : "person") + "";
    	let t6;
    	let t7;
    	let button;
    	let t9;
    	let div2;
    	let span1;
    	let t11;
    	let t12;
    	let t13;
    	let div3;
    	let span2;
    	let t15;
    	let t16;
    	let t17;
    	let span3;
    	let t19;
    	let div5;
    	let t20;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div4 = element("div");
    			span0 = element("span");
    			t0 = text(/*date*/ ctx[3]);
    			t1 = space();
    			h4 = element("h4");
    			t2 = text(/*name*/ ctx[1]);
    			t3 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t4 = text(/*name*/ ctx[1]);
    			t5 = text(" is a ");
    			t6 = text(t6_value);
    			t7 = space();
    			button = element("button");
    			button.textContent = "Reply";
    			t9 = space();
    			div2 = element("div");
    			span1 = element("span");
    			span1.textContent = "Sent to:";
    			t11 = text("  ");
    			t12 = text(/*readers*/ ctx[4]);
    			t13 = space();
    			div3 = element("div");
    			span2 = element("span");
    			span2.textContent = "subject";
    			t15 = text("  ");
    			t16 = text(/*subject*/ ctx[2]);
    			t17 = space();
    			span3 = element("span");
    			span3.textContent = "Compose message here";
    			t19 = space();
    			div5 = element("div");
    			t20 = space();
    			input = element("input");
    			set_style(span0, "background-color", "yellowgreen");
    			attr_dev(span0, "class", "svelte-1ppr3w4");
    			add_location(span0, file$2, 20, 2, 339);
    			attr_dev(h4, "class", "blg-item-title svelte-1ppr3w4");
    			set_style(h4, "background-color", "inherit");
    			add_location(h4, file$2, 21, 2, 399);
    			attr_dev(div0, "class", "little-info svelte-1ppr3w4");
    			add_location(div0, file$2, 23, 3, 484);
    			add_location(button, file$2, 26, 3, 576);
    			add_location(div1, file$2, 22, 2, 475);
    			set_style(span1, "background-color", "navy");
    			attr_dev(span1, "class", "svelte-1ppr3w4");
    			add_location(span1, file$2, 29, 3, 640);
    			add_location(div2, file$2, 28, 2, 631);
    			set_style(span2, "background-color", "navy");
    			attr_dev(span2, "class", "svelte-1ppr3w4");
    			add_location(span2, file$2, 32, 3, 733);
    			add_location(div3, file$2, 31, 2, 724);
    			set_style(div4, "padding", "6px");
    			add_location(div4, file$2, 19, 1, 309);
    			attr_dev(span3, "class", "svelte-1ppr3w4");
    			add_location(span3, file$2, 35, 1, 823);
    			attr_dev(div5, "id", "blg-window-full-text");
    			attr_dev(div5, "class", "full-display svelte-1ppr3w4");
    			add_location(div5, file$2, 36, 1, 858);
    			attr_dev(input, "type", "hidden");
    			attr_dev(input, "id", "pub-key");
    			add_location(input, file$2, 39, 1, 940);
    			attr_dev(div6, "class", "blg-el-wrapper-full svelte-1ppr3w4");
    			add_location(div6, file$2, 18, 0, 273);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div4);
    			append_dev(div4, span0);
    			append_dev(span0, t0);
    			append_dev(div4, t1);
    			append_dev(div4, h4);
    			append_dev(h4, t2);
    			append_dev(div4, t3);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t4);
    			append_dev(div0, t5);
    			append_dev(div0, t6);
    			append_dev(div1, t7);
    			append_dev(div1, button);
    			append_dev(div4, t9);
    			append_dev(div4, div2);
    			append_dev(div2, span1);
    			append_dev(div2, t11);
    			append_dev(div2, t12);
    			append_dev(div4, t13);
    			append_dev(div4, div3);
    			append_dev(div3, span2);
    			append_dev(div3, t15);
    			append_dev(div3, t16);
    			append_dev(div6, t17);
    			append_dev(div6, span3);
    			append_dev(div6, t19);
    			append_dev(div6, div5);
    			div5.innerHTML = /*message*/ ctx[6];
    			append_dev(div6, t20);
    			append_dev(div6, input);
    			set_input_value(input, /*public_key*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*do_reply*/ ctx[7], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[8])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*date*/ 8) set_data_dev(t0, /*date*/ ctx[3]);
    			if (dirty & /*name*/ 2) set_data_dev(t2, /*name*/ ctx[1]);
    			if (dirty & /*name*/ 2) set_data_dev(t4, /*name*/ ctx[1]);
    			if (dirty & /*business*/ 32 && t6_value !== (t6_value = (/*business*/ ctx[5] ? "business" : "person") + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*readers*/ 16) set_data_dev(t12, /*readers*/ ctx[4]);
    			if (dirty & /*subject*/ 4) set_data_dev(t16, /*subject*/ ctx[2]);
    			if (dirty & /*message*/ 64) div5.innerHTML = /*message*/ ctx[6];
    			if (dirty & /*public_key*/ 1) {
    				set_input_value(input, /*public_key*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			mounted = false;
    			run_all(dispose);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("MessageDisplay", slots, []);
    	let { name } = $$props;
    	let { subject } = $$props;
    	let { date } = $$props;
    	let { readers } = $$props;
    	let { business } = $$props;
    	let { public_key } = $$props;
    	let { message } = $$props;

    	function do_reply() {
    		alert(subject);
    	}

    	const writable_props = ["name", "subject", "date", "readers", "business", "public_key", "message"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MessageDisplay> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		public_key = this.value;
    		$$invalidate(0, public_key);
    	}

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("subject" in $$props) $$invalidate(2, subject = $$props.subject);
    		if ("date" in $$props) $$invalidate(3, date = $$props.date);
    		if ("readers" in $$props) $$invalidate(4, readers = $$props.readers);
    		if ("business" in $$props) $$invalidate(5, business = $$props.business);
    		if ("public_key" in $$props) $$invalidate(0, public_key = $$props.public_key);
    		if ("message" in $$props) $$invalidate(6, message = $$props.message);
    	};

    	$$self.$capture_state = () => ({
    		name,
    		subject,
    		date,
    		readers,
    		business,
    		public_key,
    		message,
    		do_reply
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("subject" in $$props) $$invalidate(2, subject = $$props.subject);
    		if ("date" in $$props) $$invalidate(3, date = $$props.date);
    		if ("readers" in $$props) $$invalidate(4, readers = $$props.readers);
    		if ("business" in $$props) $$invalidate(5, business = $$props.business);
    		if ("public_key" in $$props) $$invalidate(0, public_key = $$props.public_key);
    		if ("message" in $$props) $$invalidate(6, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		public_key,
    		name,
    		subject,
    		date,
    		readers,
    		business,
    		message,
    		do_reply,
    		input_input_handler
    	];
    }

    class MessageDisplay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			name: 1,
    			subject: 2,
    			date: 3,
    			readers: 4,
    			business: 5,
    			public_key: 0,
    			message: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MessageDisplay",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[1] === undefined && !("name" in props)) {
    			console.warn("<MessageDisplay> was created without expected prop 'name'");
    		}

    		if (/*subject*/ ctx[2] === undefined && !("subject" in props)) {
    			console.warn("<MessageDisplay> was created without expected prop 'subject'");
    		}

    		if (/*date*/ ctx[3] === undefined && !("date" in props)) {
    			console.warn("<MessageDisplay> was created without expected prop 'date'");
    		}

    		if (/*readers*/ ctx[4] === undefined && !("readers" in props)) {
    			console.warn("<MessageDisplay> was created without expected prop 'readers'");
    		}

    		if (/*business*/ ctx[5] === undefined && !("business" in props)) {
    			console.warn("<MessageDisplay> was created without expected prop 'business'");
    		}

    		if (/*public_key*/ ctx[0] === undefined && !("public_key" in props)) {
    			console.warn("<MessageDisplay> was created without expected prop 'public_key'");
    		}

    		if (/*message*/ ctx[6] === undefined && !("message" in props)) {
    			console.warn("<MessageDisplay> was created without expected prop 'message'");
    		}
    	}

    	get name() {
    		throw new Error("<MessageDisplay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<MessageDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subject() {
    		throw new Error("<MessageDisplay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subject(value) {
    		throw new Error("<MessageDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get date() {
    		throw new Error("<MessageDisplay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set date(value) {
    		throw new Error("<MessageDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readers() {
    		throw new Error("<MessageDisplay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readers(value) {
    		throw new Error("<MessageDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get business() {
    		throw new Error("<MessageDisplay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set business(value) {
    		throw new Error("<MessageDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get public_key() {
    		throw new Error("<MessageDisplay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set public_key(value) {
    		throw new Error("<MessageDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get message() {
    		throw new Error("<MessageDisplay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<MessageDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/MessageEditor.svelte generated by Svelte v3.37.0 */

    const file$1 = "src/MessageEditor.svelte";

    // (81:1) {#if has_previous }
    function create_if_block$1(ctx) {
    	let span;
    	let t1;
    	let div;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Previous Message:";
    			t1 = space();
    			div = element("div");
    			attr_dev(span, "class", "large-text-label svelte-19fvcgl");
    			add_location(span, file$1, 81, 1, 2197);
    			attr_dev(div, "id", "blg-window-full-text-outgo");
    			attr_dev(div, "class", "full-display svelte-19fvcgl");
    			add_location(div, file$1, 82, 1, 2255);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			div.innerHTML = /*answer_message*/ ctx[4];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*answer_message*/ 16) div.innerHTML = /*answer_message*/ ctx[4];		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(81:1) {#if has_previous }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div5;
    	let div2;
    	let span0;
    	let t0;
    	let t1;
    	let span1;
    	let t3;
    	let div0;
    	let span2;
    	let t4;
    	let t5;
    	let t6;
    	let span3;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let div1;
    	let t13;
    	let t14;
    	let t15;
    	let t16;
    	let t17;
    	let t18;
    	let t19;
    	let t20;
    	let span4;
    	let t22;
    	let button;
    	let t24;
    	let div3;
    	let t25;
    	let div4;
    	let t26;
    	let input;
    	let mounted;
    	let dispose;
    	let if_block = /*has_previous*/ ctx[9] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div2 = element("div");
    			span0 = element("span");
    			t0 = text(/*todays_date*/ ctx[5]);
    			t1 = space();
    			span1 = element("span");
    			span1.textContent = "Sending a message to:";
    			t3 = space();
    			div0 = element("div");
    			span2 = element("span");
    			t4 = text(/*name*/ ctx[1]);
    			t5 = text(",");
    			t6 = space();
    			span3 = element("span");
    			t7 = text("who ");
    			t8 = text(/*b_label*/ ctx[7]);
    			t9 = text(" and ");
    			t10 = text(/*know_of*/ ctx[8]);
    			t11 = text(".");
    			t12 = space();
    			div1 = element("div");
    			t13 = text(/*name*/ ctx[1]);
    			t14 = text(" comes from ");
    			t15 = text(/*place_of_origin*/ ctx[2]);
    			t16 = text(" and wants you to know that: \"");
    			t17 = text(/*cool_public_info*/ ctx[3]);
    			t18 = text("\"");
    			t19 = space();
    			if (if_block) if_block.c();
    			t20 = space();
    			span4 = element("span");
    			span4.textContent = "Compose message here:";
    			t22 = space();
    			button = element("button");
    			button.textContent = "begin compositions";
    			t24 = space();
    			div3 = element("div");
    			t25 = space();
    			div4 = element("div");
    			t26 = space();
    			input = element("input");
    			set_style(span0, "background-color", "yellowgreen");
    			attr_dev(span0, "class", "svelte-19fvcgl");
    			add_location(span0, file$1, 69, 2, 1785);
    			attr_dev(span1, "class", "message_indicator svelte-19fvcgl");
    			add_location(span1, file$1, 70, 2, 1852);
    			attr_dev(span2, "class", "name svelte-19fvcgl");
    			add_location(span2, file$1, 72, 3, 1924);
    			attr_dev(span3, "class", "about_name svelte-19fvcgl");
    			add_location(span3, file$1, 73, 3, 1961);
    			add_location(div0, file$1, 71, 2, 1915);
    			attr_dev(div1, "class", "cool-stuff svelte-19fvcgl");
    			add_location(div1, file$1, 75, 2, 2034);
    			set_style(div2, "padding", "6px");
    			add_location(div2, file$1, 68, 1, 1755);
    			attr_dev(span4, "class", "large-text-label svelte-19fvcgl");
    			add_location(span4, file$1, 86, 1, 2357);
    			attr_dev(button, "class", "medium_button svelte-19fvcgl");
    			add_location(button, file$1, 86, 62, 2418);
    			attr_dev(div3, "id", "blg-window-full-text-outgo");
    			attr_dev(div3, "class", "full-display-bottom svelte-19fvcgl");
    			add_location(div3, file$1, 87, 1, 2504);
    			attr_dev(div4, "id", "blg-window-full-text-outgo-script");
    			attr_dev(div4, "class", "is-nothing svelte-19fvcgl");
    			add_location(div4, file$1, 90, 1, 2604);
    			attr_dev(input, "type", "hidden");
    			attr_dev(input, "id", "pub-key-outgo");
    			add_location(input, file$1, 91, 1, 2676);
    			attr_dev(div5, "class", "blg-el-wrapper-full svelte-19fvcgl");
    			add_location(div5, file$1, 67, 0, 1719);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div2);
    			append_dev(div2, span0);
    			append_dev(span0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, span1);
    			append_dev(div2, t3);
    			append_dev(div2, div0);
    			append_dev(div0, span2);
    			append_dev(span2, t4);
    			append_dev(span2, t5);
    			append_dev(div0, t6);
    			append_dev(div0, span3);
    			append_dev(span3, t7);
    			append_dev(span3, t8);
    			append_dev(span3, t9);
    			append_dev(span3, t10);
    			append_dev(span3, t11);
    			append_dev(div2, t12);
    			append_dev(div2, div1);
    			append_dev(div1, t13);
    			append_dev(div1, t14);
    			append_dev(div1, t15);
    			append_dev(div1, t16);
    			append_dev(div1, t17);
    			append_dev(div1, t18);
    			append_dev(div5, t19);
    			if (if_block) if_block.m(div5, null);
    			append_dev(div5, t20);
    			append_dev(div5, span4);
    			append_dev(div5, t22);
    			append_dev(div5, button);
    			append_dev(div5, t24);
    			append_dev(div5, div3);
    			div3.innerHTML = /*contact_page*/ ctx[6];
    			append_dev(div5, t25);
    			append_dev(div5, div4);
    			append_dev(div5, t26);
    			append_dev(div5, input);
    			set_input_value(input, /*public_key*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*start_composing*/ ctx[10], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[12])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*todays_date*/ 32) set_data_dev(t0, /*todays_date*/ ctx[5]);
    			if (dirty & /*name*/ 2) set_data_dev(t4, /*name*/ ctx[1]);
    			if (dirty & /*b_label*/ 128) set_data_dev(t8, /*b_label*/ ctx[7]);
    			if (dirty & /*know_of*/ 256) set_data_dev(t10, /*know_of*/ ctx[8]);
    			if (dirty & /*name*/ 2) set_data_dev(t13, /*name*/ ctx[1]);
    			if (dirty & /*place_of_origin*/ 4) set_data_dev(t15, /*place_of_origin*/ ctx[2]);
    			if (dirty & /*cool_public_info*/ 8) set_data_dev(t17, /*cool_public_info*/ ctx[3]);
    			if (/*has_previous*/ ctx[9]) if_block.p(ctx, dirty);
    			if (dirty & /*contact_page*/ 64) div3.innerHTML = /*contact_page*/ ctx[6];
    			if (dirty & /*public_key*/ 1) {
    				set_input_value(input, /*public_key*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (if_block) if_block.d();
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
    	validate_slots("MessageEditor", slots, []);
    	let { name } = $$props;
    	let { place_of_origin } = $$props;
    	let { cool_public_info } = $$props;
    	let { business } = $$props;
    	let { public_key } = $$props;
    	let { answer_message } = $$props;
    	let todays_date = "";
    	let contact_page = "";
    	let b_label = "";
    	let know_of = "";
    	let has_previous = answer_message && typeof answer_message === "string" && answer_message.length;

    	async function start_composing() {
    		let b_or_p = business ? "business" : "profile";
    		let srver = location.host;
    		srver = srver.replace("5111", "6111");
    		let prot = location.protocol; // prot for (prot)ocol
    		let data_stem = "contact_form";
    		let sp = "//";

    		let post_data = {
    			name,
    			"place_of_origin": encodeURIComponent(place_of_origin),
    			"cool_public_info": encodeURIComponent(cool_public_info)
    		};

    		let search_result = await postData(`${prot}${sp}${srver}/${data_stem}/${b_or_p}`, post_data);

    		if (search_result) {
    			let data = search_result;

    			if (data) {
    				//
    				let html = data.html;

    				$$invalidate(6, contact_page = decodeURIComponent(html));
    				let script = data.script;
    				script = decodeURIComponent(script);
    				script = script.replace("{{when}}", Date.now());
    				addscript(script, "blg-window-full-text-outgo-script", true);
    			} //
    		}
    	}

    	const writable_props = [
    		"name",
    		"place_of_origin",
    		"cool_public_info",
    		"business",
    		"public_key",
    		"answer_message"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MessageEditor> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		public_key = this.value;
    		$$invalidate(0, public_key);
    	}

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("place_of_origin" in $$props) $$invalidate(2, place_of_origin = $$props.place_of_origin);
    		if ("cool_public_info" in $$props) $$invalidate(3, cool_public_info = $$props.cool_public_info);
    		if ("business" in $$props) $$invalidate(11, business = $$props.business);
    		if ("public_key" in $$props) $$invalidate(0, public_key = $$props.public_key);
    		if ("answer_message" in $$props) $$invalidate(4, answer_message = $$props.answer_message);
    	};

    	$$self.$capture_state = () => ({
    		name,
    		place_of_origin,
    		cool_public_info,
    		business,
    		public_key,
    		answer_message,
    		todays_date,
    		contact_page,
    		b_label,
    		know_of,
    		has_previous,
    		convert_date,
    		start_composing
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("place_of_origin" in $$props) $$invalidate(2, place_of_origin = $$props.place_of_origin);
    		if ("cool_public_info" in $$props) $$invalidate(3, cool_public_info = $$props.cool_public_info);
    		if ("business" in $$props) $$invalidate(11, business = $$props.business);
    		if ("public_key" in $$props) $$invalidate(0, public_key = $$props.public_key);
    		if ("answer_message" in $$props) $$invalidate(4, answer_message = $$props.answer_message);
    		if ("todays_date" in $$props) $$invalidate(5, todays_date = $$props.todays_date);
    		if ("contact_page" in $$props) $$invalidate(6, contact_page = $$props.contact_page);
    		if ("b_label" in $$props) $$invalidate(7, b_label = $$props.b_label);
    		if ("know_of" in $$props) $$invalidate(8, know_of = $$props.know_of);
    		if ("has_previous" in $$props) $$invalidate(9, has_previous = $$props.has_previous);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*business*/ 2048) {
    			$$invalidate(7, b_label = business ? " is a business" : " is a person");
    		}

    		if ($$self.$$.dirty & /*public_key*/ 1) {
    			$$invalidate(8, know_of = public_key !== false
    			? " is someone I know"
    			: " is a new introduction");
    		}
    	};

    	{
    		$$invalidate(5, todays_date = new Date().toISOString());
    	}

    	return [
    		public_key,
    		name,
    		place_of_origin,
    		cool_public_info,
    		answer_message,
    		todays_date,
    		contact_page,
    		b_label,
    		know_of,
    		has_previous,
    		start_composing,
    		business,
    		input_input_handler
    	];
    }

    class MessageEditor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			name: 1,
    			place_of_origin: 2,
    			cool_public_info: 3,
    			business: 11,
    			public_key: 0,
    			answer_message: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MessageEditor",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[1] === undefined && !("name" in props)) {
    			console.warn("<MessageEditor> was created without expected prop 'name'");
    		}

    		if (/*place_of_origin*/ ctx[2] === undefined && !("place_of_origin" in props)) {
    			console.warn("<MessageEditor> was created without expected prop 'place_of_origin'");
    		}

    		if (/*cool_public_info*/ ctx[3] === undefined && !("cool_public_info" in props)) {
    			console.warn("<MessageEditor> was created without expected prop 'cool_public_info'");
    		}

    		if (/*business*/ ctx[11] === undefined && !("business" in props)) {
    			console.warn("<MessageEditor> was created without expected prop 'business'");
    		}

    		if (/*public_key*/ ctx[0] === undefined && !("public_key" in props)) {
    			console.warn("<MessageEditor> was created without expected prop 'public_key'");
    		}

    		if (/*answer_message*/ ctx[4] === undefined && !("answer_message" in props)) {
    			console.warn("<MessageEditor> was created without expected prop 'answer_message'");
    		}
    	}

    	get name() {
    		throw new Error("<MessageEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<MessageEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get place_of_origin() {
    		throw new Error("<MessageEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set place_of_origin(value) {
    		throw new Error("<MessageEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cool_public_info() {
    		throw new Error("<MessageEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cool_public_info(value) {
    		throw new Error("<MessageEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get business() {
    		throw new Error("<MessageEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set business(value) {
    		throw new Error("<MessageEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get public_key() {
    		throw new Error("<MessageEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set public_key(value) {
    		throw new Error("<MessageEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get answer_message() {
    		throw new Error("<MessageEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set answer_message(value) {
    		throw new Error("<MessageEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.37.0 */

    const { Object: Object_1, console: console_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[63] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[60] = list[i];
    	child_ctx[27] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[60] = list[i];
    	child_ctx[26] = i;
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[58] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (600:2) <Label>
    function create_default_slot_4(ctx) {
    	let t_value = /*tab*/ ctx[65] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[2] & /*tab*/ 8 && t_value !== (t_value = /*tab*/ ctx[65] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(600:2) <Label>",
    		ctx
    	});

    	return block;
    }

    // (599:3) <Tab {tab}>
    function create_default_slot_3(ctx) {
    	let label;
    	let current;

    	label = new CommonLabel({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_changes = {};

    			if (dirty[2] & /*$$scope, tab*/ 24) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(599:3) <Tab {tab}>",
    		ctx
    	});

    	return block;
    }

    // (597:1) <TabBar tabs={['Signup', 'Messages', 'Introductions', 'Contacts', 'About Us']} let:tab bind:active>
    function create_default_slot_2(ctx) {
    	let tab;
    	let current;

    	tab = new Tab({
    			props: {
    				tab: /*tab*/ ctx[65],
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tab.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tab_changes = {};
    			if (dirty[2] & /*tab*/ 8) tab_changes.tab = /*tab*/ ctx[65];

    			if (dirty[2] & /*$$scope, tab*/ 24) {
    				tab_changes.$$scope = { dirty, ctx };
    			}

    			tab.$set(tab_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(597:1) <TabBar tabs={['Signup', 'Messages', 'Introductions', 'Contacts', 'About Us']} let:tab bind:active>",
    		ctx
    	});

    	return block;
    }

    // (761:36) 
    function create_if_block_9(ctx) {
    	let div;
    	let t0;
    	let br0;
    	let t1;
    	let br1;
    	let t2;
    	let br2;
    	let t3;
    	let br3;
    	let t4;
    	let span;
    	let t6;
    	let br4;
    	let t7;
    	let br5;
    	let t8;
    	let br6;
    	let t9;
    	let br7;
    	let t10;
    	let br8;
    	let t11;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("This service is free. It is a way for you to set up messaging with other people.\n\tIt is like email, but it offers an alernative ways of running your message process.\n\t");
    			br0 = element("br");
    			t1 = text("\n\tFor one, there is no email service associated with this way of handling messages. \n\tAll messages and interfaces for interacting with the processes are stored on the Inner Planetary File System.\n\t");
    			br1 = element("br");
    			t2 = text("\n\tYour contact pages is stored there. This tool makes the contact page and stores it for you. Then when someone wants to send \n\tyou a message, they access your contact page. The person who sends you a message will write a message on your page and click send.\n\tThe contact page you use will send a message service that is baked into the contact page. \n\t");
    			br2 = element("br");
    			t3 = text("\n\tThis tool, makes and stores the kind of contact page you want to store. So, by selecting the type of contact page, you will also be selecting \n\thow you want to communicate. You also get to select your style of contact page. Maybe you want to have your picture on it, maybe not.\n\tDepending on the community of contact page makers, you may find different styles. Each style is part of a template. And, you select the template.\n\t");
    			br3 = element("br");
    			t4 = space();
    			span = element("span");
    			span.textContent = "How to get the word out about your page?";
    			t6 = text(" You are probably used to handing out a business card with your email on it.\n\tBut, instead of that, you can hand out the link to your contact page. The actual link that you receive when you sign up might be hard to read. \n\tBut, you can give out the contents of the fields that you entered in order to make your contact page. \n\t");
    			br4 = element("br");
    			t7 = text("\n\tThe reason we have asked for information you might tell anyone is that we are asking for information you want to share. This information should identify you,\n\tbut not give away secrets. When someone sends a message, we can find your contact page by reprocessing the same information.\n\t");
    			br5 = element("br");
    			t8 = text("\n\tIf you don't want to print you contact information on your business card, you can always just give out the hash code.\n\tBut, keep in mind, your contacts will have to type it.\n\t");
    			br6 = element("br");
    			t9 = text("\n\tNow, you can store contact information in your list of contacts. Each of these links will find the contact page.\n\t");
    			br7 = element("br");
    			t10 = text("\n\tNow about getting unsoliceted mail or blog feeds from organizations. For these you get a separate number. Messages being sent through a messaging service will use\n\tan API link to send messages to the agreed upon topic (the topic you tell the organization that they can bug you about.) You can use your topic dashbaord to \n\tselect the latest news from organization you care about. \n\t");
    			br8 = element("br");
    			t11 = text("\n\tMessages from contacts will show up in your mail stream (promail). Find links to that on your management dashboard (also generated by when you sign up.)\n\tTo help you find your information when you go back to your browser, the information you enter on signing up will be stored in your broswer's database (indexedDb).\n\tIf you switch browsers, you can always enter your information again, and click \"restore\". You will also find an option to remove your information from your browser.");
    			attr_dev(br0, "class", "svelte-gncbva");
    			add_location(br0, file, 764, 1, 24042);
    			attr_dev(br1, "class", "svelte-gncbva");
    			add_location(br1, file, 767, 1, 24243);
    			attr_dev(br2, "class", "svelte-gncbva");
    			add_location(br2, file, 771, 1, 24599);
    			attr_dev(br3, "class", "svelte-gncbva");
    			add_location(br3, file, 775, 1, 25031);
    			set_style(span, "font-weight", "bold");
    			attr_dev(span, "class", "svelte-gncbva");
    			add_location(span, file, 776, 1, 25037);
    			attr_dev(br4, "class", "svelte-gncbva");
    			add_location(br4, file, 779, 1, 25444);
    			attr_dev(br5, "class", "svelte-gncbva");
    			add_location(br5, file, 782, 1, 25735);
    			attr_dev(br6, "class", "svelte-gncbva");
    			add_location(br6, file, 785, 1, 25916);
    			attr_dev(br7, "class", "svelte-gncbva");
    			add_location(br7, file, 787, 1, 26036);
    			attr_dev(br8, "class", "svelte-gncbva");
    			add_location(br8, file, 791, 1, 26424);
    			attr_dev(div, "class", "team_message svelte-gncbva");
    			add_location(div, file, 761, 1, 23845);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, br0);
    			append_dev(div, t1);
    			append_dev(div, br1);
    			append_dev(div, t2);
    			append_dev(div, br2);
    			append_dev(div, t3);
    			append_dev(div, br3);
    			append_dev(div, t4);
    			append_dev(div, span);
    			append_dev(div, t6);
    			append_dev(div, br4);
    			append_dev(div, t7);
    			append_dev(div, br5);
    			append_dev(div, t8);
    			append_dev(div, br6);
    			append_dev(div, t9);
    			append_dev(div, br7);
    			append_dev(div, t10);
    			append_dev(div, br8);
    			append_dev(div, t11);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(761:36) ",
    		ctx
    	});

    	return block;
    }

    // (709:35) 
    function create_if_block_5(ctx) {
    	let div8;
    	let div1;
    	let input0;
    	let t0;
    	let select;
    	let t1;
    	let div0;
    	let button0;
    	let t2;
    	let button0_disabled_value;
    	let t3;
    	let button1;
    	let t4;
    	let button1_disabled_value;
    	let t5;
    	let button2;
    	let t6;
    	let button2_disabled_value;
    	let t7;
    	let div6;
    	let br0;
    	let t8;
    	let div2;
    	let label0;
    	let t10;
    	let input1;
    	let t11;
    	let input2;
    	let t12;
    	let t13;
    	let div3;
    	let t14;
    	let div4;
    	let t15;
    	let div5;
    	let label1;
    	let br1;
    	let t17;
    	let textarea;
    	let t18;
    	let div7;
    	let span;
    	let t20;
    	let t21;
    	let t22;
    	let br2;
    	let br3;
    	let t23;
    	let button3;
    	let mounted;
    	let dispose;
    	let each_value_3 = /*filteredIndviduals*/ ctx[2];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	function select_block_type_3(ctx, dirty) {
    		if (/*c_business*/ ctx[17]) return create_if_block_8;
    		return create_else_block_4;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_4(ctx, dirty) {
    		if (/*c_business*/ ctx[17]) return create_if_block_7;
    		return create_else_block_3;
    	}

    	let current_block_type_1 = select_block_type_4(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	function select_block_type_5(ctx, dirty) {
    		if (/*c_business*/ ctx[17]) return create_if_block_6;
    		return create_else_block_2;
    	}

    	let current_block_type_2 = select_block_type_5(ctx);
    	let if_block2 = current_block_type_2(ctx);

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div1 = element("div");
    			input0 = element("input");
    			t0 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			div0 = element("div");
    			button0 = element("button");
    			t2 = text("add");
    			t3 = space();
    			button1 = element("button");
    			t4 = text("update");
    			t5 = space();
    			button2 = element("button");
    			t6 = text("delete");
    			t7 = space();
    			div6 = element("div");
    			br0 = element("br");
    			t8 = space();
    			div2 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name:";
    			t10 = space();
    			input1 = element("input");
    			t11 = space();
    			input2 = element("input");
    			t12 = space();
    			if_block0.c();
    			t13 = space();
    			div3 = element("div");
    			if_block1.c();
    			t14 = space();
    			div4 = element("div");
    			if_block2.c();
    			t15 = space();
    			div5 = element("div");
    			label1 = element("label");
    			label1.textContent = "Cool Public Info";
    			br1 = element("br");
    			t17 = space();
    			textarea = element("textarea");
    			t18 = space();
    			div7 = element("div");
    			span = element("span");
    			span.textContent = "Compose a new message for:";
    			t20 = space();
    			t21 = text(/*c_name*/ ctx[13]);
    			t22 = space();
    			br2 = element("br");
    			br3 = element("br");
    			t23 = space();
    			button3 = element("button");
    			button3.textContent = "compose";
    			attr_dev(input0, "placeholder", "filter prefix");
    			attr_dev(input0, "class", "svelte-gncbva");
    			add_location(input0, file, 711, 3, 21610);
    			attr_dev(select, "size", 5);
    			attr_dev(select, "class", "svelte-gncbva");
    			if (/*i*/ ctx[4] === void 0) add_render_callback(() => /*select_change_handler_1*/ ctx[40].call(select));
    			add_location(select, file, 712, 3, 21669);
    			button0.disabled = button0_disabled_value = !/*c_name*/ ctx[13];
    			attr_dev(button0, "class", "svelte-gncbva");
    			add_location(button0, file, 718, 4, 21854);
    			button1.disabled = button1_disabled_value = !/*c_name*/ ctx[13] || !/*selected*/ ctx[3];
    			attr_dev(button1, "class", "svelte-gncbva");
    			add_location(button1, file, 719, 4, 21923);
    			button2.disabled = button2_disabled_value = !/*selected*/ ctx[3];
    			attr_dev(button2, "class", "svelte-gncbva");
    			add_location(button2, file, 720, 4, 22011);
    			attr_dev(div0, "class", "buttons svelte-gncbva");
    			add_location(div0, file, 717, 3, 21828);
    			attr_dev(div1, "class", "item svelte-gncbva");
    			add_location(div1, file, 710, 2, 21587);
    			attr_dev(br0, "class", "svelte-gncbva");
    			add_location(br0, file, 724, 3, 22171);
    			attr_dev(label0, "for", "name");
    			set_style(label0, "display", "inline");
    			attr_dev(label0, "class", "svelte-gncbva");
    			add_location(label0, file, 726, 4, 22208);
    			attr_dev(input1, "id", "name");
    			attr_dev(input1, "placeholder", "Name");
    			set_style(input1, "display", "inline");
    			attr_dev(input1, "class", "svelte-gncbva");
    			add_location(input1, file, 727, 4, 22268);
    			attr_dev(input2, "type", "checkbox");
    			set_style(input2, "display", "inline");
    			attr_dev(input2, "class", "svelte-gncbva");
    			add_location(input2, file, 728, 4, 22352);
    			attr_dev(div2, "class", "inner_div svelte-gncbva");
    			add_location(div2, file, 725, 3, 22179);
    			attr_dev(div3, "class", "inner_div svelte-gncbva");
    			add_location(div3, file, 735, 3, 22533);
    			attr_dev(div4, "class", "inner_div svelte-gncbva");
    			add_location(div4, file, 742, 3, 22925);
    			attr_dev(label1, "for", "self-text");
    			attr_dev(label1, "class", "svelte-gncbva");
    			add_location(label1, file, 750, 3, 23372);
    			attr_dev(br1, "class", "svelte-gncbva");
    			add_location(br1, file, 750, 50, 23419);
    			attr_dev(textarea, "id", "self-text");
    			attr_dev(textarea, "placeholder", "Copy info given to you by your new contact");
    			attr_dev(textarea, "class", "svelte-gncbva");
    			add_location(textarea, file, 751, 3, 23427);
    			attr_dev(div5, "class", "inner_div svelte-gncbva");
    			add_location(div5, file, 749, 3, 23344);
    			attr_dev(div6, "class", "item svelte-gncbva");
    			set_style(div6, "border-top", "darkslategrey solid 2px");
    			add_location(div6, file, 723, 2, 22105);
    			attr_dev(span, "class", "top_instructions svelte-gncbva");
    			add_location(span, file, 755, 3, 23633);
    			attr_dev(br2, "class", "svelte-gncbva");
    			add_location(br2, file, 756, 3, 23711);
    			attr_dev(br3, "class", "svelte-gncbva");
    			add_location(br3, file, 756, 7, 23715);
    			attr_dev(button3, "class", "long_button svelte-gncbva");
    			add_location(button3, file, 757, 3, 23723);
    			attr_dev(div7, "class", "item svelte-gncbva");
    			set_style(div7, "border-top", "darkslategrey solid 2px");
    			add_location(div7, file, 754, 2, 23565);
    			attr_dev(div8, "class", "items svelte-gncbva");
    			add_location(div8, file, 709, 1, 21565);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div1);
    			append_dev(div1, input0);
    			set_input_value(input0, /*prefix*/ ctx[0]);
    			append_dev(div1, t0);
    			append_dev(div1, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*i*/ ctx[4]);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(button0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, button1);
    			append_dev(button1, t4);
    			append_dev(div0, t5);
    			append_dev(div0, button2);
    			append_dev(button2, t6);
    			append_dev(div8, t7);
    			append_dev(div8, div6);
    			append_dev(div6, br0);
    			append_dev(div6, t8);
    			append_dev(div6, div2);
    			append_dev(div2, label0);
    			append_dev(div2, t10);
    			append_dev(div2, input1);
    			set_input_value(input1, /*c_name*/ ctx[13]);
    			append_dev(div2, t11);
    			append_dev(div2, input2);
    			input2.checked = /*c_business*/ ctx[17];
    			append_dev(div2, t12);
    			if_block0.m(div2, null);
    			append_dev(div6, t13);
    			append_dev(div6, div3);
    			if_block1.m(div3, null);
    			append_dev(div6, t14);
    			append_dev(div6, div4);
    			if_block2.m(div4, null);
    			append_dev(div6, t15);
    			append_dev(div6, div5);
    			append_dev(div5, label1);
    			append_dev(div5, br1);
    			append_dev(div5, t17);
    			append_dev(div5, textarea);
    			set_input_value(textarea, /*c_cool_public_info*/ ctx[16]);
    			append_dev(div8, t18);
    			append_dev(div8, div7);
    			append_dev(div7, span);
    			append_dev(div7, t20);
    			append_dev(div7, t21);
    			append_dev(div7, t22);
    			append_dev(div7, br2);
    			append_dev(div7, br3);
    			append_dev(div7, t23);
    			append_dev(div7, button3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[39]),
    					listen_dev(select, "change", /*select_change_handler_1*/ ctx[40]),
    					listen_dev(button0, "click", /*add_contact*/ ctx[22], false, false, false),
    					listen_dev(button1, "click", /*update_contact*/ ctx[23], false, false, false),
    					listen_dev(button2, "click", /*remove_contact*/ ctx[24], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[41]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[42]),
    					listen_dev(textarea, "input", /*textarea_input_handler_1*/ ctx[47]),
    					listen_dev(button3, "click", pop_editor, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*prefix*/ 1 && input0.value !== /*prefix*/ ctx[0]) {
    				set_input_value(input0, /*prefix*/ ctx[0]);
    			}

    			if (dirty[0] & /*filteredIndviduals*/ 4) {
    				each_value_3 = /*filteredIndviduals*/ ctx[2];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}

    			if (dirty[0] & /*i*/ 16) {
    				select_option(select, /*i*/ ctx[4]);
    			}

    			if (dirty[0] & /*c_name*/ 8192 && button0_disabled_value !== (button0_disabled_value = !/*c_name*/ ctx[13])) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty[0] & /*c_name, selected*/ 8200 && button1_disabled_value !== (button1_disabled_value = !/*c_name*/ ctx[13] || !/*selected*/ ctx[3])) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (dirty[0] & /*selected*/ 8 && button2_disabled_value !== (button2_disabled_value = !/*selected*/ ctx[3])) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}

    			if (dirty[0] & /*c_name*/ 8192 && input1.value !== /*c_name*/ ctx[13]) {
    				set_input_value(input1, /*c_name*/ ctx[13]);
    			}

    			if (dirty[0] & /*c_business*/ 131072) {
    				input2.checked = /*c_business*/ ctx[17];
    			}

    			if (current_block_type !== (current_block_type = select_block_type_3(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div2, null);
    				}
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_4(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div3, null);
    				}
    			}

    			if (current_block_type_2 === (current_block_type_2 = select_block_type_5(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type_2(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(div4, null);
    				}
    			}

    			if (dirty[0] & /*c_cool_public_info*/ 65536) {
    				set_input_value(textarea, /*c_cool_public_info*/ ctx[16]);
    			}

    			if (dirty[0] & /*c_name*/ 8192) set_data_dev(t21, /*c_name*/ ctx[13]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			destroy_each(each_blocks, detaching);
    			if_block0.d();
    			if_block1.d();
    			if_block2.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(709:35) ",
    		ctx
    	});

    	return block;
    }

    // (689:39) 
    function create_if_block_4(ctx) {
    	let div0;
    	let t1;
    	let div2;
    	let div1;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let th1;
    	let th2;
    	let t5;
    	let each_value_2 = /*inbound_solicitation_messages*/ ctx[7];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Introduction Messages";
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Date";
    			th1 = element("th");
    			th1.textContent = "Sender";
    			th2 = element("th");
    			th2.textContent = "Subject";
    			t5 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "svelte-gncbva");
    			add_location(div0, file, 689, 2, 20811);
    			set_style(th0, "width", "20%");
    			attr_dev(th0, "class", "svelte-gncbva");
    			add_location(th0, file, 695, 7, 20945);
    			set_style(th1, "width", "30%");
    			attr_dev(th1, "class", "svelte-gncbva");
    			add_location(th1, file, 695, 38, 20976);
    			set_style(th2, "width", "60%");
    			set_style(th2, "text-align", "left");
    			attr_dev(th2, "class", "svelte-gncbva");
    			add_location(th2, file, 695, 71, 21009);
    			attr_dev(tr, "class", "svelte-gncbva");
    			add_location(tr, file, 694, 6, 20933);
    			attr_dev(thead, "class", "svelte-gncbva");
    			add_location(thead, file, 693, 5, 20919);
    			set_style(table, "width", "100%");
    			attr_dev(table, "class", "svelte-gncbva");
    			add_location(table, file, 692, 4, 20887);
    			attr_dev(div1, "class", "tableFixHead svelte-gncbva");
    			add_location(div1, file, 691, 3, 20855);
    			attr_dev(div2, "class", "svelte-gncbva");
    			add_location(div2, file, 690, 2, 20846);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, th1);
    			append_dev(tr, th2);
    			append_dev(table, t5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*full_message, inbound_solicitation_messages*/ 33554560) {
    				each_value_2 = /*inbound_solicitation_messages*/ ctx[7];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(689:39) ",
    		ctx
    	});

    	return block;
    }

    // (669:35) 
    function create_if_block_3(ctx) {
    	let div0;
    	let t1;
    	let div2;
    	let div1;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let th1;
    	let th2;
    	let t5;
    	let each_value_1 = /*inbound_contact_messages*/ ctx[8];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Your Message History";
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Date";
    			th1 = element("th");
    			th1.textContent = "Sender";
    			th2 = element("th");
    			th2.textContent = "Subject";
    			t5 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "svelte-gncbva");
    			add_location(div0, file, 669, 2, 20056);
    			set_style(th0, "width", "20%");
    			attr_dev(th0, "class", "svelte-gncbva");
    			add_location(th0, file, 675, 7, 20189);
    			set_style(th1, "width", "30%");
    			attr_dev(th1, "class", "svelte-gncbva");
    			add_location(th1, file, 675, 38, 20220);
    			set_style(th2, "width", "60%");
    			set_style(th2, "text-align", "left");
    			attr_dev(th2, "class", "svelte-gncbva");
    			add_location(th2, file, 675, 71, 20253);
    			attr_dev(tr, "class", "svelte-gncbva");
    			add_location(tr, file, 674, 6, 20177);
    			attr_dev(thead, "class", "svelte-gncbva");
    			add_location(thead, file, 673, 5, 20163);
    			set_style(table, "width", "100%");
    			attr_dev(table, "class", "svelte-gncbva");
    			add_location(table, file, 672, 4, 20131);
    			attr_dev(div1, "class", "tableFixHead svelte-gncbva");
    			add_location(div1, file, 671, 3, 20099);
    			attr_dev(div2, "class", "svelte-gncbva");
    			add_location(div2, file, 670, 2, 20090);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, th1);
    			append_dev(tr, th2);
    			append_dev(table, t5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*full_message, inbound_contact_messages*/ 33554688) {
    				each_value_1 = /*inbound_contact_messages*/ ctx[8];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(669:35) ",
    		ctx
    	});

    	return block;
    }

    // (604:1) {#if (active === 'Signup')}
    function create_if_block(ctx) {
    	let div13;
    	let div6;
    	let br0;
    	let t0;
    	let div0;
    	let t2;
    	let br1;
    	let t3;
    	let div1;
    	let label0;
    	let t5;
    	let input0;
    	let t6;
    	let input1;
    	let span0;
    	let t8;
    	let div2;
    	let t9;
    	let div3;
    	let t10;
    	let div4;
    	let label1;
    	let br2;
    	let t12;
    	let textarea;
    	let t13;
    	let div5;
    	let t14;
    	let span1;
    	let t16;
    	let t17;
    	let button;
    	let t19;
    	let div12;
    	let div7;
    	let t21;
    	let div11;
    	let div8;
    	let t23;
    	let div10;
    	let div9;
    	let select;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*business*/ ctx[12]) return create_if_block_2;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_2(ctx, dirty) {
    		if (/*business*/ ctx[12]) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type_1 = select_block_type_2(ctx);
    	let if_block1 = current_block_type_1(ctx);
    	let each_value = /*contact_form_links*/ ctx[20];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div13 = element("div");
    			div6 = element("div");
    			br0 = element("br");
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = "Please enter Unique Information about yourself which you would be willing to share with anyone:";
    			t2 = space();
    			br1 = element("br");
    			t3 = space();
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name:";
    			t5 = space();
    			input0 = element("input");
    			t6 = space();
    			input1 = element("input");
    			span0 = element("span");
    			span0.textContent = "Business (if checked)";
    			t8 = space();
    			div2 = element("div");
    			if_block0.c();
    			t9 = space();
    			div3 = element("div");
    			if_block1.c();
    			t10 = space();
    			div4 = element("div");
    			label1 = element("label");
    			label1.textContent = "Cool Public Info";
    			br2 = element("br");
    			t12 = space();
    			textarea = element("textarea");
    			t13 = space();
    			div5 = element("div");
    			t14 = text("Enter your information above. It will be used to make an identifier to be used in your contact page.\n\t\t\t\tThe information should be unique. For example, I know that my name is shared by at least three other people on the planet,\n\t\t\t\tall of whom were born in the same year. But, they are from differts or countries.\n\t\t\t\tThe information that you enter may be used later in an API link only if you have interests for which you would be willing to receive unsolicited mail \n\t\t\t\tfrom groups you choose to select. You may make selections at a later time. \n\t\t\t\t");
    			span1 = element("span");
    			span1.textContent = "Note:";
    			t16 = text(" no information will be sent to any organization as a result of signing up.\n\t\t\t\tAll information and your personalized assets, including your contact page will be stored in the Interplanetary File System, and will be \n\t\t\t\taccessible from there through any service you wish to use to access it.");
    			t17 = space();
    			button = element("button");
    			button.textContent = "Create my contact page.";
    			t19 = space();
    			div12 = element("div");
    			div7 = element("div");
    			div7.textContent = "drop a picture here";
    			t21 = space();
    			div11 = element("div");
    			div8 = element("div");
    			div8.textContent = "Select a contact from";
    			t23 = space();
    			div10 = element("div");
    			div9 = element("div");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(br0, "class", "svelte-gncbva");
    			add_location(br0, file, 606, 3, 17117);
    			attr_dev(div0, "class", "top_instructions svelte-gncbva");
    			add_location(div0, file, 607, 3, 17125);
    			attr_dev(br1, "class", "svelte-gncbva");
    			add_location(br1, file, 610, 3, 17270);
    			attr_dev(label0, "for", "name");
    			set_style(label0, "display", "inline");
    			attr_dev(label0, "class", "svelte-gncbva");
    			add_location(label0, file, 612, 4, 17307);
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "placeholder", "Name");
    			set_style(input0, "display", "inline");
    			attr_dev(input0, "class", "svelte-gncbva");
    			add_location(input0, file, 613, 4, 17367);
    			attr_dev(input1, "type", "checkbox");
    			set_style(input1, "display", "inline");
    			attr_dev(input1, "class", "svelte-gncbva");
    			add_location(input1, file, 614, 4, 17449);
    			attr_dev(span0, "class", "svelte-gncbva");
    			add_location(span0, file, 614, 76, 17521);
    			attr_dev(div1, "class", "inner_div svelte-gncbva");
    			add_location(div1, file, 611, 3, 17278);
    			attr_dev(div2, "class", "inner_div svelte-gncbva");
    			add_location(div2, file, 616, 3, 17569);
    			attr_dev(div3, "class", "inner_div svelte-gncbva");
    			add_location(div3, file, 623, 3, 17955);
    			attr_dev(label1, "for", "self-text");
    			attr_dev(label1, "class", "svelte-gncbva");
    			add_location(label1, file, 631, 3, 18396);
    			attr_dev(br2, "class", "svelte-gncbva");
    			add_location(br2, file, 631, 50, 18443);
    			attr_dev(textarea, "id", "self-text");
    			attr_dev(textarea, "placeholder", "Something you would say to anyone about yourself");
    			attr_dev(textarea, "class", "svelte-gncbva");
    			add_location(textarea, file, 632, 3, 18451);
    			attr_dev(div4, "class", "inner_div svelte-gncbva");
    			add_location(div4, file, 630, 3, 18368);
    			set_style(span1, "color", "blue");
    			attr_dev(span1, "class", "svelte-gncbva");
    			add_location(span1, file, 641, 4, 19171);
    			attr_dev(div5, "class", "nice_message svelte-gncbva");
    			add_location(div5, file, 635, 3, 18587);
    			attr_dev(button, "class", "long_button svelte-gncbva");
    			add_location(button, file, 645, 3, 19515);
    			attr_dev(div6, "class", "signerupper svelte-gncbva");
    			add_location(div6, file, 605, 2, 17088);
    			attr_dev(div7, "class", "svelte-gncbva");
    			add_location(div7, file, 648, 3, 19639);
    			attr_dev(div8, "class", "svelte-gncbva");
    			add_location(div8, file, 652, 4, 19692);
    			attr_dev(select, "size", 10);
    			attr_dev(select, "class", "svelte-gncbva");
    			if (/*form_index*/ ctx[5] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[38].call(select));
    			add_location(select, file, 656, 6, 19775);
    			attr_dev(div9, "class", "tableFixHead svelte-gncbva");
    			add_location(div9, file, 654, 5, 19740);
    			attr_dev(div10, "class", "svelte-gncbva");
    			add_location(div10, file, 653, 4, 19729);
    			attr_dev(div11, "class", "svelte-gncbva");
    			add_location(div11, file, 651, 3, 19682);
    			attr_dev(div12, "class", "signerupper svelte-gncbva");
    			add_location(div12, file, 647, 2, 19610);
    			attr_dev(div13, "class", "signup-grid-container svelte-gncbva");
    			add_location(div13, file, 604, 1, 17050);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div13, anchor);
    			append_dev(div13, div6);
    			append_dev(div6, br0);
    			append_dev(div6, t0);
    			append_dev(div6, div0);
    			append_dev(div6, t2);
    			append_dev(div6, br1);
    			append_dev(div6, t3);
    			append_dev(div6, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t5);
    			append_dev(div1, input0);
    			set_input_value(input0, /*name*/ ctx[1]);
    			append_dev(div1, t6);
    			append_dev(div1, input1);
    			input1.checked = /*business*/ ctx[12];
    			append_dev(div1, span0);
    			append_dev(div6, t8);
    			append_dev(div6, div2);
    			if_block0.m(div2, null);
    			append_dev(div6, t9);
    			append_dev(div6, div3);
    			if_block1.m(div3, null);
    			append_dev(div6, t10);
    			append_dev(div6, div4);
    			append_dev(div4, label1);
    			append_dev(div4, br2);
    			append_dev(div4, t12);
    			append_dev(div4, textarea);
    			set_input_value(textarea, /*cool_public_info*/ ctx[11]);
    			append_dev(div6, t13);
    			append_dev(div6, div5);
    			append_dev(div5, t14);
    			append_dev(div5, span1);
    			append_dev(div5, t16);
    			append_dev(div6, t17);
    			append_dev(div6, button);
    			append_dev(div13, t19);
    			append_dev(div13, div12);
    			append_dev(div12, div7);
    			append_dev(div12, t21);
    			append_dev(div12, div11);
    			append_dev(div11, div8);
    			append_dev(div11, t23);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*form_index*/ ctx[5]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[31]),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[32]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[37]),
    					listen_dev(button, "click", /*add_profile*/ ctx[21], false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[38])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*name*/ 2 && input0.value !== /*name*/ ctx[1]) {
    				set_input_value(input0, /*name*/ ctx[1]);
    			}

    			if (dirty[0] & /*business*/ 4096) {
    				input1.checked = /*business*/ ctx[12];
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div2, null);
    				}
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_2(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div3, null);
    				}
    			}

    			if (dirty[0] & /*cool_public_info*/ 2048) {
    				set_input_value(textarea, /*cool_public_info*/ ctx[11]);
    			}

    			if (dirty[0] & /*contact_form_links*/ 1048576) {
    				each_value = /*contact_form_links*/ ctx[20];
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

    			if (dirty[0] & /*form_index*/ 32) {
    				select_option(select, /*form_index*/ ctx[5]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div13);
    			if_block0.d();
    			if_block1.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(604:1) {#if (active === 'Signup')}",
    		ctx
    	});

    	return block;
    }

    // (714:4) {#each filteredIndviduals as individual, i}
    function create_each_block_3(ctx) {
    	let option;
    	let t_value = /*individual*/ ctx[63].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*i*/ ctx[4];
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-gncbva");
    			add_location(option, file, 714, 5, 21755);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filteredIndviduals*/ 4 && t_value !== (t_value = /*individual*/ ctx[63].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(714:4) {#each filteredIndviduals as individual, i}",
    		ctx
    	});

    	return block;
    }

    // (732:4) {:else}
    function create_else_block_4(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Person";
    			attr_dev(span, "class", "svelte-gncbva");
    			add_location(span, file, 732, 4, 22490);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_4.name,
    		type: "else",
    		source: "(732:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (730:4) {#if c_business }
    function create_if_block_8(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Business";
    			attr_dev(span, "class", "svelte-gncbva");
    			add_location(span, file, 730, 4, 22452);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(730:4) {#if c_business }",
    		ctx
    	});

    	return block;
    }

    // (739:4) {:else}
    function create_else_block_3(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "DOB: ";
    			input = element("input");
    			attr_dev(label, "for", "DOB");
    			set_style(label, "display", "inline");
    			attr_dev(label, "class", "svelte-gncbva");
    			add_location(label, file, 739, 4, 22760);
    			attr_dev(input, "id", "DOB");
    			attr_dev(input, "placeholder", "Date of Birth");
    			set_style(input, "display", "inline");
    			attr_dev(input, "class", "svelte-gncbva");
    			add_location(input, file, 739, 58, 22814);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*c_DOB*/ ctx[14]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_5*/ ctx[44]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*c_DOB*/ 16384 && input.value !== /*c_DOB*/ ctx[14]) {
    				set_input_value(input, /*c_DOB*/ ctx[14]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(739:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (737:4) {#if c_business }
    function create_if_block_7(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Year of Inception: ";
    			input = element("input");
    			attr_dev(label, "for", "DOB");
    			set_style(label, "display", "inline");
    			attr_dev(label, "class", "svelte-gncbva");
    			add_location(label, file, 737, 4, 22584);
    			attr_dev(input, "id", "DOB");
    			attr_dev(input, "placeholder", "Year of Inception");
    			set_style(input, "display", "inline");
    			attr_dev(input, "class", "svelte-gncbva");
    			add_location(input, file, 737, 72, 22652);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*c_DOB*/ ctx[14]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_4*/ ctx[43]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*c_DOB*/ 16384 && input.value !== /*c_DOB*/ ctx[14]) {
    				set_input_value(input, /*c_DOB*/ ctx[14]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(737:4) {#if c_business }",
    		ctx
    	});

    	return block;
    }

    // (746:4) {:else}
    function create_else_block_2(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Place of Origin: ";
    			input = element("input");
    			attr_dev(label, "for", "POO");
    			set_style(label, "display", "inline");
    			attr_dev(label, "class", "svelte-gncbva");
    			add_location(label, file, 746, 4, 23153);
    			attr_dev(input, "id", "POO");
    			attr_dev(input, "placeholder", "Place of Origin");
    			set_style(input, "display", "inline");
    			attr_dev(input, "class", "svelte-gncbva");
    			add_location(input, file, 746, 70, 23219);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*c_place_of_origin*/ ctx[15]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_7*/ ctx[46]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*c_place_of_origin*/ 32768 && input.value !== /*c_place_of_origin*/ ctx[15]) {
    				set_input_value(input, /*c_place_of_origin*/ ctx[15]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(746:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (744:4) {#if c_business }
    function create_if_block_6(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Main Office: ";
    			input = element("input");
    			attr_dev(label, "for", "POO");
    			set_style(label, "display", "inline");
    			attr_dev(label, "class", "svelte-gncbva");
    			add_location(label, file, 744, 4, 22976);
    			attr_dev(input, "id", "POO");
    			attr_dev(input, "placeholder", "Main Office");
    			set_style(input, "display", "inline");
    			attr_dev(input, "class", "svelte-gncbva");
    			add_location(input, file, 744, 67, 23039);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*c_place_of_origin*/ ctx[15]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_6*/ ctx[45]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*c_place_of_origin*/ 32768 && input.value !== /*c_place_of_origin*/ ctx[15]) {
    				set_input_value(input, /*c_place_of_origin*/ ctx[15]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(744:4) {#if c_business }",
    		ctx
    	});

    	return block;
    }

    // (699:4) {#each inbound_solicitation_messages as a_message, i_i }
    function create_each_block_2(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*a_message*/ ctx[60].date + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*a_message*/ ctx[60].name + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*a_message*/ ctx[60].subject + "";
    	let t4;
    	let t5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			attr_dev(td0, "class", "date svelte-gncbva");
    			set_style(td0, "width", "20%");
    			set_style(td0, "text-align", "center");
    			add_location(td0, file, 700, 6, 21262);
    			attr_dev(td1, "class", "sender svelte-gncbva");
    			set_style(td1, "width", "30%");
    			add_location(td1, file, 701, 6, 21344);
    			attr_dev(td2, "class", "subject svelte-gncbva");
    			set_style(td2, "width", "60%");
    			add_location(td2, file, 702, 6, 21410);
    			attr_dev(tr, "id", "m_intro_" + /*i_i*/ ctx[27]);
    			attr_dev(tr, "class", "element-poster svelte-gncbva");
    			add_location(tr, file, 699, 5, 21154);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(tr, "click", /*full_message*/ ctx[25], false, false, false),
    					listen_dev(tr, "mouseover", show_subject, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*inbound_solicitation_messages*/ 128 && t0_value !== (t0_value = /*a_message*/ ctx[60].date + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*inbound_solicitation_messages*/ 128 && t2_value !== (t2_value = /*a_message*/ ctx[60].name + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*inbound_solicitation_messages*/ 128 && t4_value !== (t4_value = /*a_message*/ ctx[60].subject + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(699:4) {#each inbound_solicitation_messages as a_message, i_i }",
    		ctx
    	});

    	return block;
    }

    // (679:4) {#each inbound_contact_messages as a_message, c_i }
    function create_each_block_1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*a_message*/ ctx[60].date + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*a_message*/ ctx[60].name + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*a_message*/ ctx[60].subject + "";
    	let t4;
    	let t5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			attr_dev(td0, "class", "date svelte-gncbva");
    			set_style(td0, "width", "20%");
    			set_style(td0, "text-align", "center");
    			add_location(td0, file, 680, 6, 20503);
    			attr_dev(td1, "class", "sender svelte-gncbva");
    			set_style(td1, "width", "30%");
    			add_location(td1, file, 681, 6, 20585);
    			attr_dev(td2, "class", "subject svelte-gncbva");
    			set_style(td2, "width", "60%");
    			add_location(td2, file, 682, 6, 20651);
    			attr_dev(tr, "id", "m_contact_" + /*c_i*/ ctx[26]);
    			attr_dev(tr, "class", "element-poster svelte-gncbva");
    			add_location(tr, file, 679, 5, 20393);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(tr, "click", /*full_message*/ ctx[25], false, false, false),
    					listen_dev(tr, "mouseover", show_subject, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*inbound_contact_messages*/ 256 && t0_value !== (t0_value = /*a_message*/ ctx[60].date + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*inbound_contact_messages*/ 256 && t2_value !== (t2_value = /*a_message*/ ctx[60].name + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*inbound_contact_messages*/ 256 && t4_value !== (t4_value = /*a_message*/ ctx[60].subject + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(679:4) {#each inbound_contact_messages as a_message, c_i }",
    		ctx
    	});

    	return block;
    }

    // (620:4) {:else}
    function create_else_block_1(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "DOB: ";
    			input = element("input");
    			attr_dev(label, "for", "DOB");
    			set_style(label, "display", "inline");
    			attr_dev(label, "class", "svelte-gncbva");
    			add_location(label, file, 620, 4, 17792);
    			attr_dev(input, "id", "DOB");
    			attr_dev(input, "placeholder", "Date of Birth");
    			set_style(input, "display", "inline");
    			attr_dev(input, "class", "svelte-gncbva");
    			add_location(input, file, 620, 58, 17846);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*DOB*/ ctx[9]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[34]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*DOB*/ 512 && input.value !== /*DOB*/ ctx[9]) {
    				set_input_value(input, /*DOB*/ ctx[9]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(620:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (618:4) {#if business }
    function create_if_block_2(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Year of Inception: ";
    			input = element("input");
    			attr_dev(label, "for", "DOB");
    			set_style(label, "display", "inline");
    			attr_dev(label, "class", "svelte-gncbva");
    			add_location(label, file, 618, 4, 17618);
    			attr_dev(input, "id", "DOB");
    			attr_dev(input, "placeholder", "Year of Inception");
    			set_style(input, "display", "inline");
    			attr_dev(input, "class", "svelte-gncbva");
    			add_location(input, file, 618, 72, 17686);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*DOB*/ ctx[9]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[33]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*DOB*/ 512 && input.value !== /*DOB*/ ctx[9]) {
    				set_input_value(input, /*DOB*/ ctx[9]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(618:4) {#if business }",
    		ctx
    	});

    	return block;
    }

    // (627:4) {:else}
    function create_else_block(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Place of Origin: ";
    			input = element("input");
    			attr_dev(label, "for", "POO");
    			set_style(label, "display", "inline");
    			attr_dev(label, "class", "svelte-gncbva");
    			add_location(label, file, 627, 4, 18179);
    			attr_dev(input, "id", "POO");
    			attr_dev(input, "placeholder", "Place of Origin");
    			set_style(input, "display", "inline");
    			attr_dev(input, "class", "svelte-gncbva");
    			add_location(input, file, 627, 70, 18245);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*place_of_origin*/ ctx[10]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_3*/ ctx[36]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*place_of_origin*/ 1024 && input.value !== /*place_of_origin*/ ctx[10]) {
    				set_input_value(input, /*place_of_origin*/ ctx[10]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(627:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (625:4) {#if business }
    function create_if_block_1(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Main Office: ";
    			input = element("input");
    			attr_dev(label, "for", "POO");
    			set_style(label, "display", "inline");
    			attr_dev(label, "class", "svelte-gncbva");
    			add_location(label, file, 625, 4, 18004);
    			attr_dev(input, "id", "POO");
    			attr_dev(input, "placeholder", "Main Office");
    			set_style(input, "display", "inline");
    			attr_dev(input, "class", "svelte-gncbva");
    			add_location(input, file, 625, 67, 18067);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*place_of_origin*/ ctx[10]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_2*/ ctx[35]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*place_of_origin*/ 1024 && input.value !== /*place_of_origin*/ ctx[10]) {
    				set_input_value(input, /*place_of_origin*/ ctx[10]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(625:4) {#if business }",
    		ctx
    	});

    	return block;
    }

    // (658:7) {#each contact_form_links as form_link, form_index}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*form_link*/ ctx[58] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*form_index*/ ctx[5];
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-gncbva");
    			add_location(option, file, 658, 8, 19885);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
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
    		source: "(658:7) {#each contact_form_links as form_link, form_index}",
    		ctx
    	});

    	return block;
    }

    // (800:0) <FloatWindow title={message_selected.name} scale_size={window_scale} index={0} use_smoke={false}>
    function create_default_slot_1(ctx) {
    	let messagedisplay;
    	let current;
    	const messagedisplay_spread_levels = [/*message_selected*/ ctx[18]];
    	let messagedisplay_props = {};

    	for (let i = 0; i < messagedisplay_spread_levels.length; i += 1) {
    		messagedisplay_props = assign(messagedisplay_props, messagedisplay_spread_levels[i]);
    	}

    	messagedisplay = new MessageDisplay({
    			props: messagedisplay_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(messagedisplay.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(messagedisplay, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const messagedisplay_changes = (dirty[0] & /*message_selected*/ 262144)
    			? get_spread_update(messagedisplay_spread_levels, [get_spread_object(/*message_selected*/ ctx[18])])
    			: {};

    			messagedisplay.$set(messagedisplay_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(messagedisplay.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(messagedisplay.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(messagedisplay, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(800:0) <FloatWindow title={message_selected.name} scale_size={window_scale} index={0} use_smoke={false}>",
    		ctx
    	});

    	return block;
    }

    // (804:0) <FloatWindow title={selected.name} scale_size={window_scale} index={1} use_smoke={false}>
    function create_default_slot(ctx) {
    	let messageeditor;
    	let current;
    	const messageeditor_spread_levels = [/*selected*/ ctx[3]];
    	let messageeditor_props = {};

    	for (let i = 0; i < messageeditor_spread_levels.length; i += 1) {
    		messageeditor_props = assign(messageeditor_props, messageeditor_spread_levels[i]);
    	}

    	messageeditor = new MessageEditor({
    			props: messageeditor_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(messageeditor.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(messageeditor, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const messageeditor_changes = (dirty[0] & /*selected*/ 8)
    			? get_spread_update(messageeditor_spread_levels, [get_spread_object(/*selected*/ ctx[3])])
    			: {};

    			messageeditor.$set(messageeditor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(messageeditor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(messageeditor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(messageeditor, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(804:0) <FloatWindow title={selected.name} scale_size={window_scale} index={1} use_smoke={false}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let tabbar;
    	let updating_active;
    	let t0;
    	let br;
    	let t1;
    	let t2;
    	let floatwindow0;
    	let t3;
    	let floatwindow1;
    	let current;

    	function tabbar_active_binding(value) {
    		/*tabbar_active_binding*/ ctx[30](value);
    	}

    	let tabbar_props = {
    		tabs: ["Signup", "Messages", "Introductions", "Contacts", "About Us"],
    		$$slots: {
    			default: [
    				create_default_slot_2,
    				({ tab }) => ({ 65: tab }),
    				({ tab }) => [0, 0, tab ? 8 : 0]
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*active*/ ctx[6] !== void 0) {
    		tabbar_props.active = /*active*/ ctx[6];
    	}

    	tabbar = new TabBar({ props: tabbar_props, $$inline: true });
    	binding_callbacks.push(() => bind(tabbar, "active", tabbar_active_binding));

    	function select_block_type(ctx, dirty) {
    		if (/*active*/ ctx[6] === "Signup") return create_if_block;
    		if (/*active*/ ctx[6] === "Messages") return create_if_block_3;
    		if (/*active*/ ctx[6] === "Introductions") return create_if_block_4;
    		if (/*active*/ ctx[6] === "Contacts") return create_if_block_5;
    		if (/*active*/ ctx[6] === "About Us") return create_if_block_9;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	floatwindow0 = new FloatWindow({
    			props: {
    				title: /*message_selected*/ ctx[18].name,
    				scale_size: /*window_scale*/ ctx[19],
    				index: 0,
    				use_smoke: false,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	floatwindow1 = new FloatWindow({
    			props: {
    				title: /*selected*/ ctx[3].name,
    				scale_size: /*window_scale*/ ctx[19],
    				index: 1,
    				use_smoke: false,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(tabbar.$$.fragment);
    			t0 = space();
    			br = element("br");
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			create_component(floatwindow0.$$.fragment);
    			t3 = space();
    			create_component(floatwindow1.$$.fragment);
    			attr_dev(br, "class", "svelte-gncbva");
    			add_location(br, file, 602, 2, 17015);
    			attr_dev(div, "class", "svelte-gncbva");
    			add_location(div, file, 592, 0, 16726);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(tabbar, div, null);
    			append_dev(div, t0);
    			append_dev(div, br);
    			append_dev(div, t1);
    			if (if_block) if_block.m(div, null);
    			insert_dev(target, t2, anchor);
    			mount_component(floatwindow0, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(floatwindow1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabbar_changes = {};

    			if (dirty[2] & /*$$scope, tab*/ 24) {
    				tabbar_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_active && dirty[0] & /*active*/ 64) {
    				updating_active = true;
    				tabbar_changes.active = /*active*/ ctx[6];
    				add_flush_callback(() => updating_active = false);
    			}

    			tabbar.$set(tabbar_changes);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}

    			const floatwindow0_changes = {};
    			if (dirty[0] & /*message_selected*/ 262144) floatwindow0_changes.title = /*message_selected*/ ctx[18].name;
    			if (dirty[0] & /*window_scale*/ 524288) floatwindow0_changes.scale_size = /*window_scale*/ ctx[19];

    			if (dirty[0] & /*message_selected*/ 262144 | dirty[2] & /*$$scope*/ 16) {
    				floatwindow0_changes.$$scope = { dirty, ctx };
    			}

    			floatwindow0.$set(floatwindow0_changes);
    			const floatwindow1_changes = {};
    			if (dirty[0] & /*selected*/ 8) floatwindow1_changes.title = /*selected*/ ctx[3].name;
    			if (dirty[0] & /*window_scale*/ 524288) floatwindow1_changes.scale_size = /*window_scale*/ ctx[19];

    			if (dirty[0] & /*selected*/ 8 | dirty[2] & /*$$scope*/ 16) {
    				floatwindow1_changes.$$scope = { dirty, ctx };
    			}

    			floatwindow1.$set(floatwindow1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabbar.$$.fragment, local);
    			transition_in(floatwindow0.$$.fragment, local);
    			transition_in(floatwindow1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabbar.$$.fragment, local);
    			transition_out(floatwindow0.$$.fragment, local);
    			transition_out(floatwindow1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(tabbar);

    			if (if_block) {
    				if_block.d();
    			}

    			if (detaching) detach_dev(t2);
    			destroy_component(floatwindow0, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(floatwindow1, detaching);
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

    async function gen_public_key(post_data) {
    	let keys = await promail_user_starter_keys();
    	post_data.public_key = keys.pk_str;
    	let storage_data = Object.assign({}, post_data);
    	storage_data.priv_key = keys.priv_key;
    	store_user_key(storage_data);
    }

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

    function pop_editor() {
    	start_floating_window(1);
    }

    function show_subject() {
    	
    }

    function preview_contact_form(ev) {
    	
    } // start_floating_window(2);

    function deciphered(message) {
    	return message;
    }

    function decipher_contacts(c_file_data) {
    	
    }

    function instance($$self, $$props, $$invalidate) {
    	let filteredIndviduals;
    	let selected;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let cid = "";
    	let active = "Signup";
    	let first_message = 0;
    	let messages_per_page = 100;

    	let individuals = [
    		{
    			"name": "Hans Solo",
    			"DOB": "1000",
    			"place_of_origin": "alpha centauri",
    			"cool_public_info": "He is a Master Jedi",
    			"business": false,
    			"public_key": true,
    			"cid": "4504385938",
    			"answer_message": ""
    		},
    		{
    			"name": "Max Martin",
    			"DOB": "1000",
    			"place_of_origin": "Fictional Name",
    			"cool_public_info": "He Made a lot of songs",
    			"business": true,
    			"public_key": false,
    			"cid": "4345687685",
    			"answer_message": "I got your songs"
    		},
    		{
    			"name": "Roman Polanski",
    			"DOB": "1000",
    			"place_of_origin": "Warsaw,Poland",
    			"cool_public_info": "He Made Risque Movies",
    			"business": false,
    			"public_key": true,
    			"cid": "9i58w78ew",
    			"answer_message": ""
    		}
    	];

    	let inbound_solicitation_messages = [];
    	let inbound_contact_messages = [];
    	let todays_date = new Date().toLocaleString();

    	let inbound_messages = [
    		{
    			"name": "Hans Solo",
    			"user_cid": "4504385938",
    			"subject": "Darth Vadier Attacks",
    			"date": todays_date,
    			"readers": "joe,jane,harry",
    			"business": false,
    			"public_key": true,
    			"message": "this is a message 1"
    		},
    		{
    			"name": "Max Martin",
    			"user_cid": "4345687685",
    			"subject": "Adele and Katy Perry Attacks",
    			"date": todays_date,
    			"readers": "Lady Gaga, Taylor Swift, Bruno Mars",
    			"business": false,
    			"public_key": true,
    			"message": "this is a message 2"
    		},
    		{
    			"name": "Roman Polanski",
    			"user_cid": "9i58w78ew",
    			"subject": "Charlie Manson Attacks",
    			"date": todays_date,
    			"readers": "Attorney General, LA DA, Squeeky",
    			"business": true,
    			"public_key": true,
    			"message": "this is a message 3"
    		},
    		{
    			"name": "Darth Vadar",
    			"user_cid": "869968609",
    			"subject": "Hans Solo is Mean",
    			"date": todays_date,
    			"readers": "luke,martha,chewy",
    			"business": false,
    			"public_key": false,
    			"message": "this is a message 4"
    		}
    	];

    	/*
          "wrapped_key" : false,
          "encoding" : "uri",
      "when"  ... whereas"date" is a human readable string...
    */
    	let contact_form_links = ["contact_style_1.html", "contact_style_2.html"];

    	let selected_form_link = "contact_style_1.html";

    	function find_contact_from_message(message) {
    		for (let contact of individuals) {
    			if (contact.name == message.name && message.user_cid === contact.cid) {
    				return contact;
    			}
    		}

    		return false;
    	}

    	let prefix = "";
    	let i = 0;
    	let c_i = 0;
    	let i_i = 0;
    	let form_index = 0;
    	let name = "";
    	let DOB = "";
    	let place_of_origin = "";
    	let cool_public_info = "";
    	let business = false;
    	let c_name = "";
    	let c_DOB = "";
    	let c_place_of_origin = "";
    	let c_cool_public_info = "";
    	let c_business = false;
    	let today = new Date().toUTCString();

    	let message_selected = {
    		"name": "Admin",
    		"subject": "Hello From copious.world",
    		"date": today,
    		"readers": "you",
    		"business": false,
    		"public_key": false
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
    			$$invalidate(19, window_scale.h = scale.h, window_scale);

    			$$invalidate(19, window_scale.w = scale.w, window_scale);
    		}); //

    		fetch_array_data();
    		fetch_contacts();
    	});

    	// ADD PROFILE.....
    	async function add_profile() {
    		//
    		let b_or_p = business ? "business" : "profile";

    		let srver = location.host;
    		srver = srver.replace("5111", "6111"); // CHANGE THIS
    		let prot = location.protocol; // prot for (prot)ocol
    		let data_stem = "add";
    		let sp = "//";

    		let post_data = {
    			name,
    			DOB,
    			place_of_origin,
    			cool_public_info,
    			business,
    			"public_key": false,
    			"form_link": selected_form_link, // a cid to a template ??
    			"answer_message": ""
    		};

    		//
    		await gen_public_key(post_data); // by ref

    		//
    		let search_result = await postData(`${prot}${sp}${srver}/${data_stem}/${b_or_p}`, post_data);

    		if (search_result) {
    			cid = search_result.cid;
    			post_data.cid = cid;
    			store_user_key(post_data);
    		}
    	} //

    	function add_contact() {
    		people = people.concat({ first, last });
    		$$invalidate(4, i = people.length - 1);
    		first = "";
    	}

    	function update_contact() {
    		$$invalidate(3, selected.first = first, selected);
    		$$invalidate(3, selected.last = last, selected);
    		people = people;
    	}

    	function remove_contact() {
    		// Remove selected person from the source array (people), not the filtered array
    		const index = individuals.indexOf(selected);

    		people = [...individuals.slice(0, index), ...individuals.slice(index + 1)];
    		first = last = "";
    		$$invalidate(4, i = Math.min(i, filteredIndviduals.length - 2));
    	}

    	function reset_inputs(individual) {
    		$$invalidate(13, c_name = individual ? individual.name : "");
    		$$invalidate(14, c_DOB = individual ? individual.DOB : "");
    		$$invalidate(15, c_place_of_origin = individual ? individual.place_of_origin : "");
    		$$invalidate(16, c_cool_public_info = individual ? individual.cool_public_info : "");
    		$$invalidate(17, c_business = individual ? individual.business : "");
    	}

    	function full_message(ev) {
    		if (ev) {
    			let dom_el = ev.target;

    			while (dom_el && dom_el.id.length === 0) {
    				dom_el = dom_el.parentNode;

    				if (dom_el && dom_el.id.length !== 0) {
    					let parts = dom_el.id.split("_");

    					if (parts[0] === "m") {
    						if (parts[1] === "contact") {
    							let index = parseInt(parts[2]);
    							$$invalidate(18, message_selected = inbound_contact_messages[index]);
    						} else {
    							let index = parseInt(parts[2]);
    							$$invalidate(18, message_selected = inbound_solicitation_messages[index]);
    						}

    						break;
    					}
    				}
    			}
    		}

    		let contact = find_contact_from_message(message_selected);

    		if (contact) {
    			contact.answer_message = `&lt;subject ${message_selected.subject}&gt;<br>` + message_selected.message;
    		}

    		start_floating_window(0);
    	}

    	async function fetch_array_data() {
    		let b_or_p = business ? "business" : "profile";
    		let srver = location.host;
    		srver = srver.replace("5111", "6111");
    		let prot = location.protocol; // prot for (prot)ocol
    		let data_stem = "spool";
    		let sp = "//";

    		let post_data = {
    			cid,
    			"start": first_message,
    			"count": messages_per_page,
    			"business": b_or_p
    		};

    		let search_result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data);

    		if (search_result) {
    			let data = search_result.data;

    			if (data) {
    				$$invalidate(29, inbound_messages = data.map(message => {
    					return deciphered(message);
    				}));
    			}
    		}
    	}

    	async function fetch_contacts() {
    		let b_or_p = business ? "business" : "profile";
    		let srver = location.host;
    		srver = srver.replace("5111", "6111");
    		let prot = location.protocol; // prot for (prot)ocol
    		let data_stem = "contacts";
    		let sp = "//";
    		let post_data = { cid, "business": b_or_p };
    		let search_result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data);

    		if (search_result) {
    			let data = search_result.data;

    			if (data) {
    				$$invalidate(28, individuals = JSON.parse(decipher_contacts()));
    			}
    		}
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function tabbar_active_binding(value) {
    		active = value;
    		$$invalidate(6, active);
    	}

    	function input0_input_handler() {
    		name = this.value;
    		$$invalidate(1, name);
    	}

    	function input1_change_handler() {
    		business = this.checked;
    		$$invalidate(12, business);
    	}

    	function input_input_handler() {
    		DOB = this.value;
    		$$invalidate(9, DOB);
    	}

    	function input_input_handler_1() {
    		DOB = this.value;
    		$$invalidate(9, DOB);
    	}

    	function input_input_handler_2() {
    		place_of_origin = this.value;
    		$$invalidate(10, place_of_origin);
    	}

    	function input_input_handler_3() {
    		place_of_origin = this.value;
    		$$invalidate(10, place_of_origin);
    	}

    	function textarea_input_handler() {
    		cool_public_info = this.value;
    		$$invalidate(11, cool_public_info);
    	}

    	function select_change_handler() {
    		form_index = select_value(this);
    		$$invalidate(5, form_index);
    	}

    	function input0_input_handler_1() {
    		prefix = this.value;
    		$$invalidate(0, prefix);
    	}

    	function select_change_handler_1() {
    		i = select_value(this);
    		$$invalidate(4, i);
    	}

    	function input1_input_handler() {
    		c_name = this.value;
    		$$invalidate(13, c_name);
    	}

    	function input2_change_handler() {
    		c_business = this.checked;
    		$$invalidate(17, c_business);
    	}

    	function input_input_handler_4() {
    		c_DOB = this.value;
    		$$invalidate(14, c_DOB);
    	}

    	function input_input_handler_5() {
    		c_DOB = this.value;
    		$$invalidate(14, c_DOB);
    	}

    	function input_input_handler_6() {
    		c_place_of_origin = this.value;
    		$$invalidate(15, c_place_of_origin);
    	}

    	function input_input_handler_7() {
    		c_place_of_origin = this.value;
    		$$invalidate(15, c_place_of_origin);
    	}

    	function textarea_input_handler_1() {
    		c_cool_public_info = this.value;
    		$$invalidate(16, c_cool_public_info);
    	}

    	$$self.$capture_state = () => ({
    		Tab,
    		Label: CommonLabel,
    		TabBar,
    		onMount,
    		FloatWindow,
    		MessageDisplay,
    		MessageEditor,
    		cid,
    		active,
    		first_message,
    		messages_per_page,
    		individuals,
    		inbound_solicitation_messages,
    		inbound_contact_messages,
    		todays_date,
    		inbound_messages,
    		contact_form_links,
    		selected_form_link,
    		find_contact_from_message,
    		prefix,
    		i,
    		c_i,
    		i_i,
    		form_index,
    		name,
    		DOB,
    		place_of_origin,
    		cool_public_info,
    		business,
    		c_name,
    		c_DOB,
    		c_place_of_origin,
    		c_cool_public_info,
    		c_business,
    		today,
    		message_selected,
    		gen_public_key,
    		window_scale,
    		popup_size,
    		add_profile,
    		add_contact,
    		update_contact,
    		remove_contact,
    		reset_inputs,
    		pop_editor,
    		show_subject,
    		full_message,
    		preview_contact_form,
    		deciphered,
    		decipher_contacts,
    		fetch_array_data,
    		fetch_contacts,
    		filteredIndviduals,
    		selected
    	});

    	$$self.$inject_state = $$props => {
    		if ("cid" in $$props) cid = $$props.cid;
    		if ("active" in $$props) $$invalidate(6, active = $$props.active);
    		if ("first_message" in $$props) first_message = $$props.first_message;
    		if ("messages_per_page" in $$props) messages_per_page = $$props.messages_per_page;
    		if ("individuals" in $$props) $$invalidate(28, individuals = $$props.individuals);
    		if ("inbound_solicitation_messages" in $$props) $$invalidate(7, inbound_solicitation_messages = $$props.inbound_solicitation_messages);
    		if ("inbound_contact_messages" in $$props) $$invalidate(8, inbound_contact_messages = $$props.inbound_contact_messages);
    		if ("todays_date" in $$props) todays_date = $$props.todays_date;
    		if ("inbound_messages" in $$props) $$invalidate(29, inbound_messages = $$props.inbound_messages);
    		if ("contact_form_links" in $$props) $$invalidate(20, contact_form_links = $$props.contact_form_links);
    		if ("selected_form_link" in $$props) selected_form_link = $$props.selected_form_link;
    		if ("prefix" in $$props) $$invalidate(0, prefix = $$props.prefix);
    		if ("i" in $$props) $$invalidate(4, i = $$props.i);
    		if ("c_i" in $$props) $$invalidate(26, c_i = $$props.c_i);
    		if ("i_i" in $$props) $$invalidate(27, i_i = $$props.i_i);
    		if ("form_index" in $$props) $$invalidate(5, form_index = $$props.form_index);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("DOB" in $$props) $$invalidate(9, DOB = $$props.DOB);
    		if ("place_of_origin" in $$props) $$invalidate(10, place_of_origin = $$props.place_of_origin);
    		if ("cool_public_info" in $$props) $$invalidate(11, cool_public_info = $$props.cool_public_info);
    		if ("business" in $$props) $$invalidate(12, business = $$props.business);
    		if ("c_name" in $$props) $$invalidate(13, c_name = $$props.c_name);
    		if ("c_DOB" in $$props) $$invalidate(14, c_DOB = $$props.c_DOB);
    		if ("c_place_of_origin" in $$props) $$invalidate(15, c_place_of_origin = $$props.c_place_of_origin);
    		if ("c_cool_public_info" in $$props) $$invalidate(16, c_cool_public_info = $$props.c_cool_public_info);
    		if ("c_business" in $$props) $$invalidate(17, c_business = $$props.c_business);
    		if ("today" in $$props) today = $$props.today;
    		if ("message_selected" in $$props) $$invalidate(18, message_selected = $$props.message_selected);
    		if ("window_scale" in $$props) $$invalidate(19, window_scale = $$props.window_scale);
    		if ("filteredIndviduals" in $$props) $$invalidate(2, filteredIndviduals = $$props.filteredIndviduals);
    		if ("selected" in $$props) $$invalidate(3, selected = $$props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*prefix, individuals*/ 268435457) {
    			$$invalidate(2, filteredIndviduals = prefix
    			? individuals.filter(individual => {
    					const name = `${individual.name}`;
    					return name.toLowerCase().startsWith(prefix.toLowerCase());
    				})
    			: individuals);
    		}

    		if ($$self.$$.dirty[0] & /*filteredIndviduals, i*/ 20) {
    			$$invalidate(3, selected = filteredIndviduals[i]);
    		}

    		if ($$self.$$.dirty[0] & /*selected*/ 8) {
    			reset_inputs(selected);
    		}

    		if ($$self.$$.dirty[0] & /*form_index*/ 32) {
    			selected_form_link = contact_form_links[form_index];
    		}

    		if ($$self.$$.dirty[0] & /*inbound_messages*/ 536870912) {
    			{
    				$$invalidate(8, inbound_contact_messages = inbound_messages.filter(msg => {
    					return msg.public_key == true;
    				}));

    				$$invalidate(7, inbound_solicitation_messages = inbound_messages.filter(msg => {
    					return msg.public_key == false;
    				}));
    			}
    		}
    	};

    	return [
    		prefix,
    		name,
    		filteredIndviduals,
    		selected,
    		i,
    		form_index,
    		active,
    		inbound_solicitation_messages,
    		inbound_contact_messages,
    		DOB,
    		place_of_origin,
    		cool_public_info,
    		business,
    		c_name,
    		c_DOB,
    		c_place_of_origin,
    		c_cool_public_info,
    		c_business,
    		message_selected,
    		window_scale,
    		contact_form_links,
    		add_profile,
    		add_contact,
    		update_contact,
    		remove_contact,
    		full_message,
    		c_i,
    		i_i,
    		individuals,
    		inbound_messages,
    		tabbar_active_binding,
    		input0_input_handler,
    		input1_change_handler,
    		input_input_handler,
    		input_input_handler_1,
    		input_input_handler_2,
    		input_input_handler_3,
    		textarea_input_handler,
    		select_change_handler,
    		input0_input_handler_1,
    		select_change_handler_1,
    		input1_input_handler,
    		input2_change_handler,
    		input_input_handler_4,
    		input_input_handler_5,
    		input_input_handler_6,
    		input_input_handler_7,
    		textarea_input_handler_1
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, [-1, -1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
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

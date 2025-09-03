class BaseComponent extends HTMLElement {
	/**
	* Creates an instance of BaseComponent and attaches an open shadow DOM.
	*/
	constructor() {
		super();
		/**
		* Shadow root of the component to encapsulate styles and DOM.
		* @type {ShadowRoot}
		*/
		this.shadowRoot = this.attachShadow({mode:"open"});
		
		// Custom initialization method
		this.initialize();
	}
	
	/**
	* Initialization method that child components can override.
	* Set initial state or configure properties here.
	*/
	initialize() {
	  // Example: this.shadowRoot.innerHTML = `<style>p{color:red;}</style><p>Hello</p>`;
	}
	
	/**
	* Called when an observed attribute changes.
	* Child components can override this method.
	* @param {string} name - Attribute name
	* @param {string | null} oldValue - Previous value
	* @param {string | null} newValue - New value
	*/
	attributeChangedCallback(name, oldValue, newValue) {
		console.log(`Attribute "${name}" changed from "${oldValue}" to "${newValue}"`);
	}
	
	/**
	* Returns the list of attributes to observe.
	* @returns {string[]} Array of attribute names to observe
	*/
	static get observedAttributes() {
		return [];
	}
	
	/**
	* Called when the component is added to the DOM.
	*/
	connectedCallback() {
		console.log(`${this.tagName.toLowerCase()} added to page.`);
	}
	
	/**
	* Called when the component is removed from the DOM.
	*/
	disconnectedCallback() {
		console.log(`${this.tagName.toLowerCase()} removed from page.`);
	}
	
	/**
	* Helper method to dispatch a custom event easily.
	* @param {string} eventName - Name of the event
	* @param {any} detail - Data to pass with the event
	*/
	emit(eventName, detail = {}) {
		this.dispatchEvent(new CustomEvent(eventName, {
			detail,
			bubbles: true,
			composed: true
		}));
	}
	
	/**
	* Defines the custom element in the browser's Custom Elements registry.
	* @param {string} tagName - The tag name to register (must include a hyphen)
	*/
	static define(tagName) {
		if (!customElements.get(tagName)) {
			customElements.define(tagName, this);
			console.log(`Custom element <${tagName}> defined.`);
		} else {
			console.warn(`Custom element <${tagName}> is already defined.`);
		}
	}
}

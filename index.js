/**
 * BaseComponent
 *
 * Abstract base class for building reusable Web Components with
 * support for dynamic data binding and flexible template loading.
 *
 * Usage:
 *  1. Extend this class and define your own custom element.
 *  2. Provide data via the `data` property (e.g., `element.data = {...}`).
 *  3. Provide a template either:
 *      - Directly as a HTMLTemplateElement,
 *      - By referencing a template ID in the DOM,
 *      - By fetching from a remote URL,
 *      - Or let it fall back to a default template.
 *  4. Override the `render()` method in subclasses to update the UI
 *     whenever new data is assigned.
 *
 * Example:
 *  class MyCard extends BaseComponent {
 *      render() {
 *          const root = this.shadowRoot;
 *          if (!root) return;
 *          root.querySelector(".title").textContent = this._data?.title ?? "Untitled";
 *      }
 *  }
 *  customElements.define("my-card", MyCard);
 */
class BaseComponent extends HTMLElement {
    /**
     * @type {any} Holds the component's dynamic data
     * @protected
     */
    _data = null;

    /**
     * Creates a new BaseComponent instance with Shadow DOM.
     */
    constructor(){
        super();
        this.attachShadow({mode:"open"});
    }

    /**
     * Called when the component is added to the DOM.
     */
    connectedCallback(){
        this.loadTemplate()
            .then(() => this.render())
            .catch(err => console.error("Template loading failed:", err));
    }

    /**
     * Called when the component is removed from the DOM.
     */
    disconnectedCallback(){
        // Optional cleanup logic
    }

    /**
     * Assign data to the component. Automatically triggers render().
     *
     * @param {any} value - The data object assigned to this component.
     */
    set data(value){
        this._data = value;
        this.render();
    }

    /**
     * Get the current data.
     *
     * @returns {any} The current data stored in this component.
     */
    get data(){ return this._data; }

    /**
     * Load and attach a template to the Shadow DOM.
     * Supports:
     *  - Direct HTMLTemplateElement via `this.templateElement`
     *  - Template ID via `this.templateId`
     *  - Remote URL via `this.templateUrl`
     *  - Default fallback template
     *
     * @returns {Promise<void>}
     */
    async loadTemplate(){
        let templateContent = null;

        // 1. Direct HTMLTemplateElement
        if(this.templateElement instanceof HTMLTemplateElement){
            templateContent = this.templateElement.content.cloneNode(true);
        }

        // 2. Template ID in DOM
        else if(this.templateId){
            const tpl = document.getElementById(this.templateId);
            if(tpl instanceof HTMLTemplateElement){
                templateContent = tpl.content.cloneNode(true);
            }
        }

        // 3. Remote URL
        else if(this.templateUrl){
            try{
                const response = await fetch(this.templateUrl);
                if(response.ok){
                    const html = await response.text();
                    const tpl = document.createElement("template");
                    tpl.innerHTML = html;
                    templateContent = tpl.content.cloneNode(true);
                }
            }catch(err){
                console.error("Failed to fetch template:", err);
            }
        }

        // 4. Fallback template
        if(!templateContent){
            const tpl = document.createElement("template");
            tpl.innerHTML = `<div>BaseComponent initialized.</div>`;
            templateContent = tpl.content.cloneNode(true);
        }

        // Clear Shadow DOM before injecting
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.appendChild(templateContent);
    }

    /**
     * Render logic for updating the UI when data changes.
     * Override this method in subclasses.
     */
    render(){
        throw new Error(`${this.tagName.toLowerCase()} render() not implemented`);
    }
}

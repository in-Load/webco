/**
 * BaseComponent
 *
 * Abstract base class for building reusable Web Components with
 * optional Shadow DOM isolation.
 */
class BaseComponent extends HTMLElement {
    /**
     * @type {any} Holds the component's dynamic data
     * @protected
     */
    _data = null;

    /**
     * Creates a new BaseComponent instance.
     *
     * @param {boolean} [useShadow=true] - Whether to attach Shadow DOM.
     */
    constructor(useShadow = true) {
        super();
        this._useShadow = useShadow;
        if (this._useShadow) {
            this.attachShadow({ mode: "open" });
        }
    }

    /**
     * Root to render into (shadowRoot if isolated, otherwise this).
     */
    get root() {
        return this._useShadow ? this.shadowRoot : this;
    }

    /**
     * Called when the component is added to the DOM.
     */
    connectedCallback() {
        this.loadTemplate()
            .then(() => this.render())
            .catch(err => console.error("Template loading failed:", err));
    }

    /**
     * Called when the component is removed from the DOM.
     */
    disconnectedCallback() {
        // Optional cleanup
    }

    /**
     * Assign data to the component. Automatically triggers render().
     */
    set data(value) {
        this._data = value;
        this.render();
    }

    get data() {
        return this._data;
    }

    /**
     * Load and attach a template.
     */
    async loadTemplate() {
        let templateContent = null;

        if (this.templateElement instanceof HTMLTemplateElement) {
            templateContent = this.templateElement.content.cloneNode(true);
        } else if (this.templateId) {
            const tpl = document.getElementById(this.templateId);
            if (tpl instanceof HTMLTemplateElement) {
                templateContent = tpl.content.cloneNode(true);
            }
        } else if (this.templateUrl) {
            try {
                const response = await fetch(this.templateUrl);
                if (response.ok) {
                    const html = await response.text();
                    const tpl = document.createElement("template");
                    tpl.innerHTML = html;
                    templateContent = tpl.content.cloneNode(true);
                }
            } catch (err) {
                console.error("Failed to fetch template:", err);
            }
        }

        if (!templateContent) {
            const tpl = document.createElement("template");
            tpl.innerHTML = `<div>BaseComponent initialized.</div>`;
            templateContent = tpl.content.cloneNode(true);
        }

        // inject in root
        this.root.innerHTML = "";
        this.root.appendChild(templateContent);
    }

    /**
     * Render logic (to be overridden).
     */
    render() {
        throw new Error(`${this.tagName.toLowerCase()} render() not implemented`);
    }
}

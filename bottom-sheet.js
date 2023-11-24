class BottomSheet extends HTMLElement {
    _height;

    static get observedAttributes() {
        return ['shown'];
    }

    constructor() {
        super();

        const template = document.getElementById("bottomsheet");
        const contents = template.content;
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(contents.cloneNode(true));
    }

    connectedCallback() {
        const shadowRoot = this.shadowRoot;
        const sheet = shadowRoot.getElementById("sheet");
        const sheetContents = shadowRoot.querySelector(".contents");
        const draggableArea = shadowRoot.querySelector(".draggable-area");

        // Hide the sheet when clicking the background
        sheet.querySelector(".overlay").addEventListener("click", () => {
            this.setAttribute("shown", "false");
        })

        const isFocused = element => document.activeElement === element

        // Hide the sheet when pressing Escape if the target element
        // is not an input field
        window.addEventListener("keyup", (event) => {
            const isSheetElementFocused =
                sheet.contains(event.target) && isFocused(event.target)

            if (event.key === "Escape" && !isSheetElementFocused) {
                this.setAttribute("shown", "false");
            }
        })

        const touchPosition = (event) =>
            event.touches ? event.touches[0] : event

        let dragPosition

        const onDragStart = (event) => {
            dragPosition = touchPosition(event).pageY
            sheetContents.classList.add("not-selectable")
            draggableArea.style.cursor = document.body.style.cursor = "grabbing"
        }

        const onDragMove = (event) => {
            if (dragPosition === undefined) return

            const y = touchPosition(event).pageY
            const deltaY = dragPosition - y
            const deltaHeight = deltaY / window.innerHeight * 100

            this.setHeight(this._height + deltaHeight)
            dragPosition = y
        }

        const onDragEnd = () => {
            dragPosition = undefined
            sheetContents.classList.remove("not-selectable")
            draggableArea.style.cursor = document.body.style.cursor = ""

            if (this._height < 25) {
                this.setAttribute("shown", "false");
            } else if (this._height > 75) {
                this.setHeight(100)
            } else {
                this.setHeight(50)
            }
        }

        draggableArea.addEventListener("mousedown", onDragStart)
        draggableArea.addEventListener("touchstart", onDragStart)

        window.addEventListener("mousemove", onDragMove)
        window.addEventListener("touchmove", onDragMove)

        window.addEventListener("mouseup", onDragEnd)
        window.addEventListener("touchend", onDragEnd)
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === "shown") {
            const shadowRoot = this.shadowRoot;
            const sheet = shadowRoot.getElementById("sheet");

            sheet.setAttribute("aria-hidden", newVal === "true" ? "false" : "true");
            
            
        }
    }

    setHeight(val) {
        this._height = Math.max(0, Math.min(100, val));
        const contents = this.shadowRoot.querySelector(".contents");

        contents.style.height = `${this._height}vh`

        if (this._height === 100) {
            contents.classList.add("fullscreen");
        } else {
            contents.classList.remove("fullscreen");
        }
    }

    setIsSheetShown(isShown) {
        this.setAttribute("shown", String(!isShown))
    }

}

window.customElements.define('bottom-sheet', BottomSheet);
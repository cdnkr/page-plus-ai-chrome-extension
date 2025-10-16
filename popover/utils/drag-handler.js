/**
 * DragHandler - Manages drag functionality for popover elements
 * Allows users to click and drag the popover by its header
 */
export class DragHandler {
    constructor(popoverElement, headerElement) {
        this.popoverElement = popoverElement;
        this.headerElement = headerElement;
        
        // Drag state
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.initialX = 0;
        this.initialY = 0;
        
        // Bind methods to preserve 'this' context
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        if (!this.headerElement) return;
        
        // Add mousedown listener to header
        this.headerElement.addEventListener('mousedown', this.handleMouseDown);
        
        // Add global mouse events for drag handling
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    }
    
    handleMouseDown(e) {
        // Don't start drag if clicking on close button or other interactive elements
        if (e.target.closest('.close-btn')) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        this.startDrag(e);
    }
    
    handleMouseMove(e) {
        if (this.isDragging) {
            this.drag(e);
        }
    }
    
    handleMouseUp(e) {
        if (this.isDragging) {
            this.endDrag(e);
        }
    }
    
    startDrag(e) {
        this.isDragging = true;
        this.headerElement.classList.add('dragging');
        
        // Store initial mouse position and popover position
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        
        // Get current position from computed style to match the positioning mode (fixed vs absolute)
        const computedStyle = window.getComputedStyle(this.popoverElement);
        this.initialX = parseInt(computedStyle.left, 10) || 0;
        this.initialY = parseInt(computedStyle.top, 10) || 0;
        
        // Prevent text selection during drag
        document.body.style.userSelect = 'none';
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        
        // Calculate new position
        const deltaX = e.clientX - this.dragStartX;
        const deltaY = e.clientY - this.dragStartY;
        
        const newX = this.initialX + deltaX;
        const newY = this.initialY + deltaY;
        
        // Update popover position
        this.popoverElement.style.left = `${newX}px`;
        this.popoverElement.style.top = `${newY}px`;
    }
    
    endDrag(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.headerElement.classList.remove('dragging');
        
        // Restore text selection
        document.body.style.userSelect = '';
    }
    
    /**
     * Clean up event listeners when the handler is no longer needed
     */
    destroy() {
        if (this.headerElement) {
            this.headerElement.removeEventListener('mousedown', this.handleMouseDown);
        }
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        
        // Clean up any drag state
        if (this.isDragging) {
            this.endDrag({ preventDefault: () => {} });
        }
    }
}


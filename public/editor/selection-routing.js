/*
 * Selection Routing v1
 *
 * A nested visual-builder node is rendered as a DOM child of its parent.
 * Native event bubbling therefore lets a parent node react to a pointerdown
 * that actually started on a child. Other builders avoid this by treating
 * component selection as model-level behavior. We keep our current model,
 * but make the existing node handlers target-aware until the selection engine
 * is fully centralized.
 *
 * Rule:
 * - click/pointerdown on a child -> child handler only
 * - click/pointerdown on empty parent area -> parent handler
 * - resize handle -> owning node handler
 *
 * This is deliberately limited to event routing. It does not change document
 * data, hierarchy, persistence, drag math, or inspector behavior.
 */
(function(){
  const nativeAddEventListener = Element.prototype.addEventListener;
  const routedTypes = new Set(['pointerdown','click']);

  Element.prototype.addEventListener = function(type, listener, options){
    if(!listener || !routedTypes.has(type) || !this.classList?.contains('node')){
      return nativeAddEventListener.call(this,type,listener,options);
    }

    const owner = this;
    const routedListener = function(event){
      const target = event.target instanceof Element ? event.target : event.target?.parentElement;
      const deepestNode = target?.closest?.('.node');

      // Only the node that was actually hit may handle the event.
      // This prevents a parent from stealing a child's selection/drag start.
      if(deepestNode !== owner) return;

      return typeof listener === 'function'
        ? listener.call(this,event)
        : listener?.handleEvent?.call(listener,event);
    };

    return nativeAddEventListener.call(this,type,routedListener,options);
  };
})();

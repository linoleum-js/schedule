import { IntervalTable } from './components/IntervalTable/IntervalTable';



/**
 * It's too bad that it's impossible to decouple the interval and the items inside it.
 * 
 * The problem is that items should be aware of othe items. Or?
 * 
 * 1. Move item
 * 2. See that it bumps into another item
 * 3. It doesn't affect this item
 * 
 * How to make steps? Just don't understand it. In movable item?
 * Well, at least we have to update the store only if there's at least one step.
 * 
 * Maybe it's not a bad idea to keep steps in one place -- MovableElement. And in all other places we only calc everything in steps.
 * So I need to add redux right now.
 * 
 * I don't remember the nextStepDone, and I don't like it. Want to get rid of it. 
 * 
 * 
 * What if we keep the exact values, and only render it in steps? Need to think about it. Draw a scheme?
 * And we "trim" the values only on moveEnd. That should work.
 */




function App() {

  return (
    <div className="container">
      <IntervalTable />
    </div>
  )
}

export default App

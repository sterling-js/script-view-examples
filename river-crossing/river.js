// Center coordinates
const cx = width / 2;
const cy = height / 2;

// Crosser dimensions
const w = 125;
const h = 75;

// Get an array of river crossers
const crossers = Object.atoms(true);
const random = mulberry32(809322);

// Create arrow marker
d3.select(svg)
  .selectAll('defs')
  .data(['defs'])
  .join('defs')
  .selectAll('marker')
  .data(['marker'])
  .join('marker')
  .attr('id', 'arrow')
  .attr('viewBox', '0 0 10 10')
  .attr('refX', '5')
  .attr('refY', '5')
  .attr('markerWidth', '8')
  .attr('markerHeight', '8')
  .attr('orient', 'auto-start-reverse')
  .selectAll('path')
  .data(['path'])
  .join('path')
  .attr('d', 'M 0 0 L 10 5 L 0 10 z');

// Draw the river
d3.select(svg)
  .selectAll('path.river')
  .data(['river'])
  .join('path')
  .attr('class', 'river')
  .attr('d', riverData(15))
  .style('stroke', 'steelblue')
  .style('stroke-width', 25)
  .style('fill', 'none');

// Update river crosser boxes
d3.select(svg)
  .selectAll('rect')
  .data(crossers)
  .join('rect')
  .attr('width', w)
  .attr('height', h)
  .attr('x', x)
  .attr('y', y)
  .style('stroke', 'black')
  .style('fill', 'white');

// Update river crosser text
d3.select(svg)
  .selectAll('text')
  .data(crossers)
  .join('text')
  .attr('x', x)
  .attr('y', y)
  .attr('dy', '0.31em')
  .attr('text-anchor', 'middle')
  .attr('transform', `translate(${w/2}, ${h/2})`)
  .text(c => c.id().split('$')[0]);

// Draw arrows
d3.select(svg)
  .selectAll('path.eating')
  .data(eats.tuples())
  .join('path')
  .attr('class', 'eating')
  .attr('d', eatingData)
  .style('stroke', 'black')
  .style('stroke-width', 2)
  .attr('marker-end', 'url(#arrow)');

// Get the x-coordinate of a crosser
function x (crosser) {
  return cx + (crosser.in(near) ? -1.5*w-w/2 : 1.5*w-w/2);
}

// Get the y-coordinate
function y (crosser, index) {
  const _p = 25;
  const _h = crossers.length * h;
  const _t = cy - _h/2;
  return _t + index * (_p+h) - h/2;
}

function eatingData (tuple) {
  const atoms = tuple.atoms();
  const coords = atoms.map(atom => {
    const index = crossers.findIndex(c => c.equals(atom));
    return [x(atom) + w/2, y(atom, index) + h/2];
  });
  const x1 = coords[0][0];
  const y1 = coords[0][1];
  const x2 = coords[1][0];
  const y2 = coords[1][1];
  const ng = Math.atan2(y2-y1, x2-x1);
  const dx = w/2 * Math.cos(ng);
  const dy = h/2 * Math.sin(ng);
  const d = `M ${x1+dx} ${y1+dy} L ${x2-dx} ${y2-dy}`;
  return d;
}

function riverPoints (n) {
  const dy = height / n;
  const points = [];
  for (let i=-1; i<n+2; ++i) {
    const dir = (i % 2 ? -1 : 1) * random();
    points.push([
      dir * w/4, 
      i*dy
    ]);
  }
  return points;
}

function riverData (n) {
  const points = riverPoints(n);
  let d = `M ${cx} -50 S`;
  points.forEach(point => {
    d += ` ${cx + point[0]} ${point[1]}`;
  });
  return d;
}

function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}
// ETCMS branding: company logo (db_image), UI16 header properties, primary company (idempotent) - GLOBAL scope

function setProp(name, value) {
  var p = new GlideRecord('sys_properties'); p.addQuery('name', name); p.query();
  if (p.next()) { p.value = value; p.update(); } else { p.initialize(); p.name = name; p.value = value; p.type = 'string'; p.insert(); }
  gs.info('property ' + name + ' = ' + value);
}
setProp('glide.product.description', 'Novatrix Solutions - Employee Training & Certification');
setProp('glide.product.name', 'Novatrix ETCMS');
setProp('glide.product.image', 'novatrix-header.png');
setProp('glide.product.image.light', 'novatrix-header.png');
setProp('css.$navpage-header-bg', '#0F172A');
setProp('css.$navpage-header-color', '#FFFFFF');
setProp('css.$navpage-header-divider-color', '#2DD4BF');
setProp('css.$navpage-nav-selected-bg', '#2DD4BF');
setProp('css.$navpage-nav-selected-color', '#0F172A');

var c = new GlideRecord('core_company'); c.addQuery('primary', true); c.query();
while (c.next()) { c.primary = false; c.update(); }
var n = new GlideRecord('core_company'); n.addQuery('name', 'Novatrix Solutions'); n.query();
if (n.next()) { n.primary = true; n.update(); gs.info('Novatrix Solutions set as primary company'); } else gs.info('Novatrix company NOT found');
gs.info('ETCMS branding done');

export function dewPointFeel(dpF: number) {
  if (dpF < 55) return {label:'Pleasant', class:'bg-pleasant', emoji:'😌', advice:'Perfect for a run!'};
  if (dpF < 61) return {label:'Comfortable', class:'bg-comfortable', emoji:'😊', advice:'Enjoy your workout!'};
  if (dpF < 66) return {label:'Getting Sticky', class:'bg-sticky', emoji:'😓', advice:'Hydrate a bit more.'};
  if (dpF < 71) return {label:'Uncomfortable', class:'bg-uncomfortable', emoji:'🥵', advice:'Hydrate early.'};
  if (dpF < 76) return {label:'Oppressive', class:'bg-oppressive', emoji:'🥵', advice:'Run early, stay cool.'};
  return {label:'Miserable', class:'bg-miserable', emoji:'🥵', advice:'Consider indoor exercise.'};
}

export const dewPointLegend = [
  { label: 'Pleasant', class: 'bg-pleasant', emoji: '😌' },
  { label: 'Comfortable', class: 'bg-comfortable', emoji: '😊' },
  { label: 'Getting Sticky', class: 'bg-sticky', emoji: '😓' },
  { label: 'Uncomfortable', class: 'bg-uncomfortable', emoji: '🥵' },
  { label: 'Oppressive', class: 'bg-oppressive', emoji: '🥵' },
  { label: 'Miserable', class: 'bg-miserable', emoji: '🥵' },
]; 
import { COMPETITIONS } from "../constants";

const values = COMPETITIONS.map(c => `('${c}')`).join(",\n    ");

console.log(`
create or replace view competition_rewards as
select
  c.competition,
  coalesce(sum(t.sale_value), 0) as total_rewards
from (
  values
    ${values}
) as c(competition)
left join transactions t
  on t.competition = c.competition
  and t.type = 'reward'
group by c.competition;
`);

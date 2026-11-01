import Chip from './Chip';
import { joinClasses as join } from './utils';

function SingleSelectChipGroup({ options = [], selected = 'none', onChange, className }) {
  return (
    <div className={join('bitt-chip-group', className)} data-figma-node="6436:32518" role="radiogroup">
      {options.map((option, index) => {
        const key = ['first', 'second', 'third', 'fourth', 'fifth'][index] || String(index);
        const isSelected = selected === key || selected === option.value;
        return (
          <Chip key={option.value ?? key} state={isSelected ? 'active' : 'default'} onClick={() => onChange?.(option.value ?? key)}>
            {option.label ?? option.value ?? key}
          </Chip>
        );
      })}
    </div>
  );
}


export default SingleSelectChipGroup;

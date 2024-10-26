import React from 'react';
import Select from 'react-select';
import { tagNames } from '../utils/tagUtils';

interface FilterBarProps {
  filters: {
    types: string[];
    specialties: string[];
    lakes: string[];
    tags: string[];
  };
  setFilters: (filters: any) => void;
  allSpecialties: string[];
  allLakes: string[];
  allTags: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  allSpecialties,
  allLakes,
  allTags,
}) => {
  const typeOptions = [
    { value: 'winery', label: 'Wineries' },
    { value: 'brewery', label: 'Breweries' },
    { value: 'cidery', label: 'Cideries' },
    { value: 'distillery', label: 'Distilleries' },
  ];

  const specialtyOptions = allSpecialties.map((specialty) => ({
    value: specialty,
    label: specialty,
  }));

  const lakeOptions = allLakes.map((lake) => ({
    value: lake,
    label: lake,
  }));

  const tagOptions = allTags.map((tag) => ({
    value: tag,
    label: tagNames[tag],
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <Select
          isMulti
          options={typeOptions}
          value={typeOptions.filter((option) =>
            filters.types.includes(option.value)
          )}
          onChange={(selected) =>
            setFilters({
              ...filters,
              types: selected ? selected.map((option) => option.value) : [],
            })
          }
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="All types"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Specialties
        </label>
        <Select
          isMulti
          options={specialtyOptions}
          value={specialtyOptions.filter((option) =>
            filters.specialties.includes(option.value)
          )}
          onChange={(selected) =>
            setFilters({
              ...filters,
              specialties: selected
                ? selected.map((option) => option.value)
                : [],
            })
          }
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="All specialties"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lakes
        </label>
        <Select
          isMulti
          options={lakeOptions}
          value={lakeOptions.filter((option) =>
            filters.lakes.includes(option.value)
          )}
          onChange={(selected) =>
            setFilters({
              ...filters,
              lakes: selected ? selected.map((option) => option.value) : [],
            })
          }
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="All lakes"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <Select
          isMulti
          options={tagOptions}
          value={tagOptions.filter((option) =>
            filters.tags.includes(option.value)
          )}
          onChange={(selected) =>
            setFilters({
              ...filters,
              tags: selected ? selected.map((option) => option.value) : [],
            })
          }
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="All tags"
        />
      </div>
    </div>
  );
};

export default FilterBar;

import React, { ChangeEvent } from "react";
import "./styles.css";
import { FluentProvider, webLightTheme, Checkbox } from '@fluentui/react-components';
// import { Checkbox } from "@fluentui/react-components";

interface FilterOption {
  value: string;
  label: string;
}

interface CategoryFilterProps {
  filterOptions: FilterOption[];
  selectedFilter: string;
  onFilterChange: (filterValue: string) => void;
}

function CategoryFilter({ filterOptions, selectedFilter, onFilterChange }: CategoryFilterProps) {
  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    onFilterChange(selectedValue);
  };


  return (
    <FluentProvider theme={webLightTheme}>
    <div className="marker-filter">
      <h2>Filter by:</h2>
      {filterOptions.map((option) => (
        <label key={option.value} className="filter-label">
          <Checkbox className="checkbox" size="large" 
            value={option.value}
            checked={selectedFilter === option.value}
            onChange={handleFilterChange}
          />
          {option.label}
        </label>
      ))}
    </div>
    </FluentProvider>
  );
}

export default CategoryFilter;

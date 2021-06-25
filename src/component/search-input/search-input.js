import React from 'react';
import { Input } from 'antd';
import "./search-input.css"

const SearchInput = () => {
    return (
        <Input 
            placeholder="Type to search..."
            className="search-input"
            onChange={(e) => this.onLableChange(e)}
        />
    )
};

export default SearchInput;
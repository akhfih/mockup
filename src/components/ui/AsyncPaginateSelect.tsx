import React from 'react';
import { AsyncPaginate, LoadOptions } from 'react-select-async-paginate';
import type {
    GroupBase,
    OptionsOrGroups,
    StylesConfig,
    ControlProps,
    MenuProps,
    SingleValueProps,
    InputProps,
    OptionProps,
    CSSObjectWithLabel
} from 'react-select';


export interface AsyncPaginateSelectProps<OptionType, Additional = unknown> {
    value: OptionType | null;
    onChange: (value: OptionType | null) => void;
    loadOptions: LoadOptions<OptionType, GroupBase<OptionType>, Additional>;
    placeholder?: string;
    isClearable?: boolean;
    debounceTimeout?: number;
}

export function AsyncPaginateSelect<OptionType, Additional = unknown>({
    value,
    onChange,
    loadOptions,
    placeholder = 'Select...',
    isClearable = true,
    debounceTimeout = 300,
}: AsyncPaginateSelectProps<OptionType, Additional>) {
    // shadcn/ui style classes using .dark theme CSS variables
    const customStyles: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
        control: (base, state) => ({
            ...base,
            backgroundColor: 'var(--background)',
            background: 'var(--color-neutral-900)',
            border: '0.2px solid var(--input)',
            borderRadius: '0.5rem',

            boxShadow: 'none',
            color: 'var(--secondary-foreground)',
            fontSize: '12px',
            minHeight: '36px',
            height: '36px',
            width: '300px',
            paddingTop: 0,
            paddingBottom: 0,
            ":hover": {
                borderColor: state.isFocused ? 'var(--border)' : 'var(--border)',
            },
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: 'var(--background)',
            borderRadius: '0.5rem',
            marginTop: 2,
            padding: '0.25rem 0.25rem',
            boxShadow: '0 4px 32px rgba(0,0,0,0.1)',
            zIndex: 100,
            border: '1px solid var(--border)',

        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? 'var(--primary)'
                : state.isFocused
                    ? 'var(--muted)'
                    : 'transparent',
            color: 'var(--secondary-foreground)',
            padding: '0.3rem 1rem',
            fontSize: '0.9rem',
            fontWeight: state.isSelected ? 600 : 400,
            cursor: 'pointer',
            borderRadius: '0.25rem',
        }),
        singleValue: (base) => ({
            ...base,
            color: 'var(--secondary-foreground)',
            fontSize: '0.9rem',
        }),
        input: (base) => ({
            ...base,
            color: 'var(--secondary-foreground)',
            fontSize: '1rem',

        }),
        placeholder: (base) => ({
            ...base,
            color: 'var(--muted-foreground)',
            fontSize: '0.9rem',
            paddingBottom: '0.2rem',
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? 'var(--muted-foreground)' : 'var(--muted-foreground)',
            '&:hover': { color: 'var(--border)' },
        }),
        clearIndicator: (base) => ({
            ...base,
            color: 'var(--muted-foreground)',
            '&:hover': { color: 'var(--border)' },
        }),
    };
    return (
        <div className="w-full">
            <div className="relative">
                <AsyncPaginate
                    value={value}
                    onChange={onChange}
                    loadOptions={loadOptions}
                    placeholder={placeholder}
                    isClearable={isClearable}
                    debounceTimeout={debounceTimeout}
                    styles={{
                        ...customStyles,
                        control: (base, state) => ({
                            ...((typeof customStyles.control === 'function' ? customStyles.control(base, state) : base)),

                        }),
                        menu: (base, state) => ({
                            ...(typeof customStyles.menu === 'function'
                                ? customStyles.menu(base, state)
                                : base),
                            width: '100%',
                            minWidth: '100%',
                            left: 0,
                        }),
                    }}
                    menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                    menuPosition="fixed"
                />
            </div>
        </div>
    );
}

import { useState, useRef, useEffect } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface AsyncShadcnSelectProps {
    label?: string;
    placeholder?: string;
    value: string | null;
    onChange: (value: string | null) => void;
    loadOptions: (input: string) => Promise<{ label: string; value: string }[]>;
}

export function AsyncShadcnSelect({
    label,
    placeholder,
    value,
    onChange,
    loadOptions,
}: AsyncShadcnSelectProps) {
    const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);


    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInput(val);
        setLoading(true);
        const opts = await loadOptions(val);
        setOptions(opts);
        setLoading(false);
        setOpen(true);
    };

    // When value changes (selected), update input to show label
    useEffect(() => {
        if (value) {
            const selected = options.find((opt) => opt.value === value);
            if (selected) {
                setInput(selected.label);
            } else {
                setInput(value); // show raw value if not in options
            }
        } else {
            setInput("");
        }
    }, [value]);

    const handleFocus = async () => {
        setOpen(true);
        if (input && options.length === 0) {
            setLoading(true);
            const opts = await loadOptions(input);
            setOptions(opts);
            setLoading(false);
        }
    };

    const handleBlur = () => {
        setTimeout(() => setOpen(false), 150); // delay to allow click
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input) {
            onChange(input);
            setOpen(false);
        }
    };

    return (
        <div className="space-y-2">
            {label && <Label className="text-sm font-medium text-white">{label}</Label>}
            <Select value={value ?? ""} onValueChange={onChange} open={open} onOpenChange={setOpen}>
                <SelectTrigger className="w-full">
                    <input
                        ref={inputRef}
                        className="bg-transparent outline-none w-full text-white placeholder:text-[#94a3b8]"
                        placeholder={placeholder}
                        value={input}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyDown={handleInputKeyDown}
                        autoComplete="off"
                    />
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {loading ? (
                        <div className="px-4 py-2 text-sm text-muted-foreground">Loading...</div>
                    ) : options.length === 0 && input ? (
                        <div className="px-4 py-2 text-sm text-muted-foreground">No results</div>
                    ) : (
                        options.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>
        </div>
    );
}

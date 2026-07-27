import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";

type FontSelectProps = {
    fonts: {
        label: string;
        value: string;
    }[];
    selectedFont: string;
    onFontChange: (value: string) => void;
};

export default function FontSelect({
    fonts,
    selectedFont,
    onFontChange,
}: FontSelectProps) {
    return (
        <Select defaultValue={selectedFont} onValueChange={onFontChange}>
            <SelectTrigger className="w-full cursor-pointer rounded-md md:w-80">
                <SelectValue />
            </SelectTrigger>

            <SelectContent position="popper" className="mt-2 rounded-md">
                {fonts.map((item) => (
                    <SelectItem
                        key={item.value}
                        value={item.value}
                        className="cursor-pointer"
                    >
                        {item.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

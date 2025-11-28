import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label?: string;
}

export function TimePicker({ value, onChange, label }: TimePickerProps) {
  const [hours, minutes] = value.split(':');
  
  const handleHourChange = (newHour: string) => {
    onChange(`${newHour}:${minutes || '00'}`);
  };
  
  const handleMinuteChange = (newMinute: string) => {
    onChange(`${hours || '09'}:${newMinute}`);
  };
  
  const hourOptions = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0')
  );
  
  const minuteOptions = Array.from({ length: 60 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Select value={hours} onValueChange={handleHourChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {hourOptions.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-2xl font-bold text-muted-foreground">:</span>
        <div className="flex-1">
          <Select value={minutes} onValueChange={handleMinuteChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {minuteOptions.map((minute) => (
                <SelectItem key={minute} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="text-center">
        <span className="text-sm text-muted-foreground">
          Selected time: <span className="font-mono font-semibold text-foreground">{value}</span>
        </span>
      </div>
    </div>
  );
}
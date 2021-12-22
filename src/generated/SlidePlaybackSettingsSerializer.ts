// <auto-generated>
// This code was auto-generated.
// Changes to this file may cause incorrect behavior and will be lost if
// the code is regenerated.
// </auto-generated>
import { SlidePlaybackSettings } from "@src/PlayerSettings";
import { JsonHelper } from "@src/io/JsonHelper";
import { IReadable } from "@src/io/IReadable";
import { EndOfReaderError } from "@src/io/IReadable";
import { IWriteable } from "@src/io/IWriteable";
import { IOHelper } from "@src/io/IOHelper";
export class SlidePlaybackSettingsSerializer {
    public static fromJson(obj: SlidePlaybackSettings, m: unknown): void {
        if (!m) {
            return;
        } 
        JsonHelper.forEach(m, (v, k) => this.setProperty(obj, k.toLowerCase(), v)); 
    }
    public static toJson(obj: SlidePlaybackSettings | null): Map<string, unknown> | null {
        if (!obj) {
            return null;
        } 
        const o = new Map<string, unknown>(); 
        o.set("simpleslidepitchoffset", obj.simpleSlidePitchOffset); 
        o.set("simpleslidedurationratio", obj.simpleSlideDurationRatio); 
        o.set("shiftslidedurationratio", obj.shiftSlideDurationRatio); 
        return o; 
    }
    public static fromBinary(o: SlidePlaybackSettings | null, r: IReadable): SlidePlaybackSettings | null {
        if (IOHelper.isEof(r)) {
            throw new EndOfReaderError();
        } 
        if (IOHelper.readNull(r)) {
            return null;
        } 
        const obj = o != null ? o : new SlidePlaybackSettings(); 
        obj.simpleSlidePitchOffset = IOHelper.readNumber(r); 
        obj.simpleSlideDurationRatio = IOHelper.readNumber(r); 
        obj.shiftSlideDurationRatio = IOHelper.readNumber(r); 
        return obj; 
    }
    public static toBinary(obj: SlidePlaybackSettings | null, w: IWriteable): void {
        if (!obj) {
            IOHelper.writeNull(w);
            return;
        } 
        IOHelper.writeNotNull(w); 
        IOHelper.writeNumber(w, obj.simpleSlidePitchOffset); 
        IOHelper.writeNumber(w, obj.simpleSlideDurationRatio); 
        IOHelper.writeNumber(w, obj.shiftSlideDurationRatio); 
    }
    public static setProperty(obj: SlidePlaybackSettings, property: string, v: unknown): boolean {
        switch (property) {
            case "simpleslidepitchoffset":
                obj.simpleSlidePitchOffset = v! as number;
                return true;
            case "simpleslidedurationratio":
                obj.simpleSlideDurationRatio = v! as number;
                return true;
            case "shiftslidedurationratio":
                obj.shiftSlideDurationRatio = v! as number;
                return true;
        } 
        return false; 
    }
}


// <auto-generated>
// This code was auto-generated.
// Changes to this file may cause incorrect behavior and will be lost if
// the code is regenerated.
// </auto-generated>
import { NotationSettings } from "@src/NotationSettings";
import { JsonHelper } from "@src/io/JsonHelper";
import { IReadable } from "@src/io/IReadable";
import { EndOfReaderError } from "@src/io/IReadable";
import { IWriteable } from "@src/io/IWriteable";
import { IOHelper } from "@src/io/IOHelper";
import { NotationMode } from "@src/NotationSettings";
import { FingeringMode } from "@src/NotationSettings";
import { NotationElement } from "@src/NotationSettings";
import { TabRhythmMode } from "@src/NotationSettings";
export class NotationSettingsSerializer {
    public static fromJson(obj: NotationSettings, m: unknown): void {
        if (!m) {
            return;
        } 
        JsonHelper.forEach(m, (v, k) => this.setProperty(obj, k.toLowerCase(), v)); 
    }
    public static toJson(obj: NotationSettings | null): Map<string, unknown> | null {
        if (!obj) {
            return null;
        } 
        const o = new Map<string, unknown>(); 
        o.set("notationmode", obj.notationMode as number); 
        o.set("fingeringmode", obj.fingeringMode as number); 
        {
            const m = new Map<string, unknown>();
            o.set("elements", m);
            for (const [k, v] of obj.elements!) {
                m.set(k.toString(), v);
            }
        } 
        o.set("rhythmmode", obj.rhythmMode as number); 
        o.set("rhythmheight", obj.rhythmHeight); 
        o.set("transpositionpitches", obj.transpositionPitches); 
        o.set("displaytranspositionpitches", obj.displayTranspositionPitches); 
        o.set("smallgracetabnotes", obj.smallGraceTabNotes); 
        o.set("extendbendarrowsontiednotes", obj.extendBendArrowsOnTiedNotes); 
        o.set("extendlineeffectstobeatend", obj.extendLineEffectsToBeatEnd); 
        o.set("slurheight", obj.slurHeight); 
        return o; 
    }
    public static fromBinary(o: NotationSettings | null, r: IReadable): NotationSettings | null {
        if (IOHelper.isEof(r)) {
            throw new EndOfReaderError();
        } 
        if (IOHelper.readNull(r)) {
            return null;
        } 
        const obj = o != null ? o : new NotationSettings(); 
        obj.notationMode = JsonHelper.parseEnum<NotationMode>(IOHelper.readInt32LE(r), NotationMode)!; 
        obj.fingeringMode = JsonHelper.parseEnum<FingeringMode>(IOHelper.readInt32LE(r), FingeringMode)!; 
        {
            const size = IOHelper.readInt32LE(r);
            for (let i = 0;i < size;i++) {
                obj.elements.set(JsonHelper.parseEnum<NotationElement>(IOHelper.readInt32LE(r), NotationElement)!, IOHelper.readBoolean(r));
            }
        } 
        obj.rhythmMode = JsonHelper.parseEnum<TabRhythmMode>(IOHelper.readInt32LE(r), TabRhythmMode)!; 
        obj.rhythmHeight = IOHelper.readNumber(r); 
        obj.transpositionPitches = IOHelper.readNumberArray(r); 
        obj.displayTranspositionPitches = IOHelper.readNumberArray(r); 
        obj.smallGraceTabNotes = IOHelper.readBoolean(r); 
        obj.extendBendArrowsOnTiedNotes = IOHelper.readBoolean(r); 
        obj.extendLineEffectsToBeatEnd = IOHelper.readBoolean(r); 
        obj.slurHeight = IOHelper.readNumber(r); 
        return obj; 
    }
    public static toBinary(obj: NotationSettings | null, w: IWriteable): void {
        if (!obj) {
            IOHelper.writeNull(w);
            return;
        } 
        IOHelper.writeNotNull(w); 
        IOHelper.writeInt32LE(w, obj.notationMode as number); 
        IOHelper.writeInt32LE(w, obj.fingeringMode as number); 
        IOHelper.writeInt32LE(w, obj.elements.size); 
        for (const [k, v] of obj.elements!) {
            IOHelper.writeInt32LE(w, k as number);
            IOHelper.writeBoolean(w, v);
        } 
        IOHelper.writeInt32LE(w, obj.rhythmMode as number); 
        IOHelper.writeNumber(w, obj.rhythmHeight); 
        IOHelper.writeNumberArray(w, obj.transpositionPitches); 
        IOHelper.writeNumberArray(w, obj.displayTranspositionPitches); 
        IOHelper.writeBoolean(w, obj.smallGraceTabNotes); 
        IOHelper.writeBoolean(w, obj.extendBendArrowsOnTiedNotes); 
        IOHelper.writeBoolean(w, obj.extendLineEffectsToBeatEnd); 
        IOHelper.writeNumber(w, obj.slurHeight); 
    }
    public static setProperty(obj: NotationSettings, property: string, v: unknown): boolean {
        switch (property) {
            case "notationmode":
                obj.notationMode = JsonHelper.parseEnum<NotationMode>(v, NotationMode)!;
                return true;
            case "fingeringmode":
                obj.fingeringMode = JsonHelper.parseEnum<FingeringMode>(v, FingeringMode)!;
                return true;
            case "elements":
                obj.elements = new Map<NotationElement, boolean>();
                JsonHelper.forEach(v, (v, k) => {
                    obj.elements.set(JsonHelper.parseEnum<NotationElement>(k, NotationElement)!, v as boolean); 
                });
                return true;
            case "rhythmmode":
                obj.rhythmMode = JsonHelper.parseEnum<TabRhythmMode>(v, TabRhythmMode)!;
                return true;
            case "rhythmheight":
                obj.rhythmHeight = v! as number;
                return true;
            case "transpositionpitches":
                obj.transpositionPitches = v! as number[];
                return true;
            case "displaytranspositionpitches":
                obj.displayTranspositionPitches = v! as number[];
                return true;
            case "smallgracetabnotes":
                obj.smallGraceTabNotes = v! as boolean;
                return true;
            case "extendbendarrowsontiednotes":
                obj.extendBendArrowsOnTiedNotes = v! as boolean;
                return true;
            case "extendlineeffectstobeatend":
                obj.extendLineEffectsToBeatEnd = v! as boolean;
                return true;
            case "slurheight":
                obj.slurHeight = v! as number;
                return true;
        } 
        return false; 
    }
}


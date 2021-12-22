// <auto-generated>
// This code was auto-generated.
// Changes to this file may cause incorrect behavior and will be lost if
// the code is regenerated.
// </auto-generated>
import { Score } from "@src/model/Score";
import { JsonHelper } from "@src/io/JsonHelper";
import { MasterBarSerializer } from "@src/generated/model/MasterBarSerializer";
import { TrackSerializer } from "@src/generated/model/TrackSerializer";
import { RenderStylesheetSerializer } from "@src/generated/model/RenderStylesheetSerializer";
import { IReadable } from "@src/io/IReadable";
import { MasterBar } from "@src/model/MasterBar";
import { Track } from "@src/model/Track";
import { IWriteable } from "@src/io/IWriteable";
import { IOHelper } from "@src/io/IOHelper";
export class ScoreSerializer {
    public static fromJson(obj: Score, m: unknown): void {
        if (!m) {
            return;
        } 
        JsonHelper.forEach(m, (v, k) => this.setProperty(obj, k, v)); 
    }
    public static toJson(obj: Score | null): Map<string, unknown> | null {
        if (!obj) {
            return null;
        } 
        const o = new Map<string, unknown>(); 
        o.set("album", obj.album); 
        o.set("artist", obj.artist); 
        o.set("copyright", obj.copyright); 
        o.set("instructions", obj.instructions); 
        o.set("music", obj.music); 
        o.set("notices", obj.notices); 
        o.set("subtitle", obj.subTitle); 
        o.set("title", obj.title); 
        o.set("words", obj.words); 
        o.set("tab", obj.tab); 
        o.set("tempo", obj.tempo); 
        o.set("tempolabel", obj.tempoLabel); 
        o.set("masterbars", obj.masterBars.map(i => MasterBarSerializer.toJson(i))); 
        o.set("tracks", obj.tracks.map(i => TrackSerializer.toJson(i))); 
        o.set("stylesheet", RenderStylesheetSerializer.toJson(obj.stylesheet)); 
        return o; 
    }
    public static fromBinary(o: Score | null, r: IReadable): Score | null {
        if (IOHelper.readNull(r)) {
            return null;
        } 
        const obj = o != null ? o : new Score(); 
        obj.album = IOHelper.readString(r); 
        obj.artist = IOHelper.readString(r); 
        obj.copyright = IOHelper.readString(r); 
        obj.instructions = IOHelper.readString(r); 
        obj.music = IOHelper.readString(r); 
        obj.notices = IOHelper.readString(r); 
        obj.subTitle = IOHelper.readString(r); 
        obj.title = IOHelper.readString(r); 
        obj.words = IOHelper.readString(r); 
        obj.tab = IOHelper.readString(r); 
        obj.tempo = IOHelper.readNumber(r); 
        obj.tempoLabel = IOHelper.readString(r); 
        {
            obj.masterBars = [];
            const length = IOHelper.readInt32LE(r);
            for (let i = 0;i < length;i++) {
                const it = new MasterBar();
                MasterBarSerializer.fromBinary(it, r);
                obj.addMasterBar(it);
            }
        } 
        {
            obj.tracks = [];
            const length = IOHelper.readInt32LE(r);
            for (let i = 0;i < length;i++) {
                const it = new Track();
                TrackSerializer.fromBinary(it, r);
                obj.addTrack(it);
            }
        } 
        obj.stylesheet = RenderStylesheetSerializer.fromBinary(obj.stylesheet, r); 
        return obj; 
    }
    public static toBinary(obj: Score | null, w: IWriteable): void {
        if (!obj) {
            IOHelper.writeNull(w);
            return;
        } 
        IOHelper.writeNotNull(w); 
        IOHelper.writeString(w, obj.album); 
        IOHelper.writeString(w, obj.artist); 
        IOHelper.writeString(w, obj.copyright); 
        IOHelper.writeString(w, obj.instructions); 
        IOHelper.writeString(w, obj.music); 
        IOHelper.writeString(w, obj.notices); 
        IOHelper.writeString(w, obj.subTitle); 
        IOHelper.writeString(w, obj.title); 
        IOHelper.writeString(w, obj.words); 
        IOHelper.writeString(w, obj.tab); 
        IOHelper.writeNumber(w, obj.tempo); 
        IOHelper.writeString(w, obj.tempoLabel); 
        IOHelper.writeInt32LE(w, obj.masterBars.length); 
        for (const i of obj.masterBars) {
            MasterBarSerializer.toBinary(i, w);
        } 
        IOHelper.writeInt32LE(w, obj.tracks.length); 
        for (const i of obj.tracks) {
            TrackSerializer.toBinary(i, w);
        } 
        RenderStylesheetSerializer.toBinary(obj.stylesheet, w); 
    }
    public static setProperty(obj: Score, property: string, v: unknown): boolean {
        switch (property) {
            case "album":
                obj.album = v! as string;
                return true;
            case "artist":
                obj.artist = v! as string;
                return true;
            case "copyright":
                obj.copyright = v! as string;
                return true;
            case "instructions":
                obj.instructions = v! as string;
                return true;
            case "music":
                obj.music = v! as string;
                return true;
            case "notices":
                obj.notices = v! as string;
                return true;
            case "subtitle":
                obj.subTitle = v! as string;
                return true;
            case "title":
                obj.title = v! as string;
                return true;
            case "words":
                obj.words = v! as string;
                return true;
            case "tab":
                obj.tab = v! as string;
                return true;
            case "tempo":
                obj.tempo = v! as number;
                return true;
            case "tempolabel":
                obj.tempoLabel = v! as string;
                return true;
            case "masterbars":
                obj.masterBars = [];
                for (const o of (v as (Map<string, unknown> | null)[])) {
                    const i = new MasterBar();
                    MasterBarSerializer.fromJson(i, o);
                    obj.addMasterBar(i);
                }
                return true;
            case "tracks":
                obj.tracks = [];
                for (const o of (v as (Map<string, unknown> | null)[])) {
                    const i = new Track();
                    TrackSerializer.fromJson(i, o);
                    obj.addTrack(i);
                }
                return true;
        } 
        if (["stylesheet"].indexOf(property) >= 0) {
            RenderStylesheetSerializer.fromJson(obj.stylesheet, v as Map<string, unknown>);
            return true;
        } 
        return false; 
    }
}


// <auto-generated>
// This code was auto-generated.
// Changes to this file may cause incorrect behavior and will be lost if
// the code is regenerated.
// </auto-generated>
import { Beat } from "@src/model/Beat";
import { NoteCloner } from "./NoteCloner";
import { AutomationCloner } from "./AutomationCloner";
import { BendPointCloner } from "./BendPointCloner";
export class BeatCloner {
    public static clone(original: Beat): Beat {
        const clone = new Beat(); 
        clone.index = original.index; 
        clone.notes = []; 
        for (const i of original.notes!) {
            clone.addNote(NoteCloner.clone(i));
        } 
        clone.isEmpty = original.isEmpty; 
        clone.whammyStyle = original.whammyStyle; 
        clone.ottava = original.ottava; 
        clone.isLegatoOrigin = original.isLegatoOrigin; 
        clone.duration = original.duration; 
        clone.isLetRing = original.isLetRing; 
        clone.isPalmMute = original.isPalmMute; 
        clone.automations = []; 
        for (const i of original.automations!) {
            clone.automations.push(AutomationCloner.clone(i));
        } 
        clone.dots = original.dots; 
        clone.fadeIn = original.fadeIn; 
        clone.lyrics = original.lyrics ? original.lyrics.slice() : null; 
        clone.hasRasgueado = original.hasRasgueado; 
        clone.pop = original.pop; 
        clone.slap = original.slap; 
        clone.tap = original.tap; 
        clone.text = original.text; 
        clone.brushType = original.brushType; 
        clone.brushDuration = original.brushDuration; 
        clone.tupletDenominator = original.tupletDenominator; 
        clone.tupletNumerator = original.tupletNumerator; 
        clone.isContinuedWhammy = original.isContinuedWhammy; 
        clone.whammyBarType = original.whammyBarType; 
        if (original.whammyBarPoints) {
            clone.whammyBarPoints = [];
            for (const i of original.whammyBarPoints!) {
                clone.addWhammyBarPoint(BendPointCloner.clone(i));
            }
        } 
        clone.vibrato = original.vibrato; 
        clone.chordId = original.chordId; 
        clone.graceType = original.graceType; 
        clone.pickStroke = original.pickStroke; 
        clone.tremoloSpeed = original.tremoloSpeed; 
        clone.crescendo = original.crescendo; 
        clone.displayStart = original.displayStart; 
        clone.playbackStart = original.playbackStart; 
        clone.displayDuration = original.displayDuration; 
        clone.playbackDuration = original.playbackDuration; 
        clone.dynamics = original.dynamics; 
        clone.invertBeamDirection = original.invertBeamDirection; 
        clone.preferredBeamDirection = original.preferredBeamDirection; 
        clone.isEffectSlurOrigin = original.isEffectSlurOrigin; 
        clone.beamingMode = original.beamingMode; 
        return clone; 
    }
}


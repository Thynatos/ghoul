import React from 'react';
import { StorytellerCockpit, StorytellerCockpitProps } from './StorytellerCockpit';

export type StorytellerScreenProps = StorytellerCockpitProps;

/**
 * StorytellerScreen - Unified Storyteller Workspace & Session Cockpit
 * SPRINT 1 Master Storyteller Workspace Overhaul
 */
export const StorytellerScreen: React.FC<StorytellerScreenProps> = (props) => {
  return <StorytellerCockpit {...props} />;
};

export default StorytellerScreen;

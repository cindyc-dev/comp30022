export interface EventI {
  id?: string;
  title: string;
  startDateTime: Date;
  endDateTime: Date;
  location?: string;
  notes?: string;
  isExternal: boolean;
  colour: string;
}

export class ActivityObject {
  date: number
  dateObject: Date

  gameDescriptor: {
    id: number;
  };

  player: {
    id: number;
  };

  propertyInstances: [
    {
      property: {
        id: number;
      };
      value: string;
    }
  ];

  public getDate() {
    if (!this.dateObject) {
      this.dateObject = new Date(this.date);
    }
    return this.dateObject;
  }
}

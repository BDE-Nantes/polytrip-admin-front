export type VForm = {
  validate: () => boolean;
  resetValidation: () => boolean;
  reset: () => void;
};

export type UserInfo = {
  username: string;
  team_name: string;
  school_name: string;
  school_color: string;
  trip: {
    uuid: string;
    team: string;
    school: string;
    trip: {
      type: string;
      coordinates: Array<[number, number]>;
    };
    distance: number;
  };
};

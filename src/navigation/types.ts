export type RootStackParamList = {
  Login: undefined;
  Houses: undefined;
  EditProfile: undefined;
  CreateHouse: undefined;
  JoinHouse: undefined;
  HouseDashboard: { houseId: string };
  NeedsList: { houseId: string };
  Messages: { houseId: string };
  Members: { houseId: string };
  Sections: { houseId: string };
  Cleaning: { houseId: string };
  CleaningConfig: { houseId: string; sectionId: string };
};

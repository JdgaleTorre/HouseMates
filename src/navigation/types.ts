export type RootStackParamList = {
  Login: undefined;
  Houses: undefined;
  CreateHouse: undefined;
  JoinHouse: undefined;
  HouseDashboard: { houseId: string };
  NeedsList: { houseId: string };
  Members: { houseId: string };
  Sections: { houseId: string };
  Cleaning: { houseId: string };
  CleaningConfig: { houseId: string; sectionId: string };
};

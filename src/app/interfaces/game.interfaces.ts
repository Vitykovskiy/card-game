enum GameDataTypes {
  WaitingGameData = 'waiting-game',
  GameStartedState = 'game-started-state',
}

enum PlayerStatus {
  None = 'none',
  Ready = 'RD',
  NotReady = 'NR',
}

enum GameStatus {
  None = 'none',
  Waiting = 'WT',
  Playing = 'PL',
  Finished = 'FN',
}

interface ICreateGameDTO {
  creator: number;
  deck: number;
  members_num: number;
  points_to_win: number;
  status?: GameStatus;
}

interface ICreateGameResponseDTO extends ICreateGameDTO {
  gameID: string;
}

interface IJoinGameRequestDTO {
  gameId: string;
}

interface IJoinGameResponseDTO {
  memberID: string;
  avatar: string;
  color: string;
}

interface IPlayer {
  game?: number;
  avatar: string;
  status: PlayerStatus;
  points?: number;
}

interface ICreatePlayerResponseDTO extends IPlayer {
  id: number;
}

interface ICreateReviewDTO {
  game: number;
  player: number;
  visual: number;
  gameplay: number;
  recomendation: number;
}

interface IWaitingGameState {
  isReadyToPlay: boolean;
  members: { [key: string]: IPlayerInfo };
}

interface IPlayerInfo {
  id?: string;
  avatar: string;
  ready: boolean;
}

interface IPlayersListDTO {
  [key: string]: IPlayerInfo;
}

function isWaitingGameState(data: any): boolean {
  return 'game_started' in data && 'members' in data;
}

function isGameStarted(data: any): boolean {
  return 'game_started' in data;
}

function checkGameDataType(data: any): GameDataTypes | null {
  if (isWaitingGameState(data)) {
    return GameDataTypes.WaitingGameData;
  }
  if (isGameStarted(data)) {
    return GameDataTypes.GameStartedState;
  }
  return null;
}

function convertPlayersList(data: IPlayersListDTO): IPlayerInfo[] {
  const playersIds = Object.keys(data);
  const playersData = Object.values(data);
  playersData.forEach((value, index) => {
    value.id = playersIds[index];
  });
  return playersData;
}

export {
  ICreateReviewDTO,
  IPlayer as ICreatePlayerRequestDTO,
  ICreatePlayerResponseDTO,
  ICreateGameDTO,
  ICreateGameResponseDTO,
  IJoinGameRequestDTO,
  IJoinGameResponseDTO,
  IPlayerInfo,
  IWaitingGameState,
  GameStatus,
  GameDataTypes,
  PlayerStatus,
  checkGameDataType,
  convertPlayersList,
};

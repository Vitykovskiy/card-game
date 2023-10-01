interface ICreateGameRequestDTO {
  creator: number;
  deck: number;
  members_num: number;
  points_to_win: number;
  status?: Status;
}

interface ICreateGameResponseDTO {
  gameID: string;
  creator: number;
  deck: string;
  members_num: number;
  points_to_win: number;
  status?: Status;
}

interface IJoinGameRequestDTO {
  gameId: string;
}

interface IJoinGameResponseDTO {
  memberID: string;
  avatar: string;
  color: string;
}

interface ICreatePlayerDTO {
  game?: number;
  avatar: string;
  status: PlayerReadyStates;
  points?: number;
}

interface IPlayer {
  memberId: string;
  avatar: string;
  ready: boolean;
}

interface IPlayers {
  members: IPlayer[];
}

interface ICreateReviewDTO {
  game: number;
  player: number;
  visual: number;
  gameplay: number;
  recomendation: number;
}

enum PlayerReadyStates {
  Ready = 'RD',
  NotReady = 'NR',
}

enum Status {
  WT = 'Waiting',
  PL = 'Playing',
  FN = 'Finished',
}

export {
  ICreatePlayerDTO,
  ICreateGameRequestDTO,
  ICreateGameResponseDTO,
  IJoinGameRequestDTO,
  IJoinGameResponseDTO,
  ICreateReviewDTO,
  IPlayers,
  Status,
  PlayerReadyStates,
};

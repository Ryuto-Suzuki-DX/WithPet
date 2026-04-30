/*
 * user関連の型
 */

// マイページ表示用ユーザー
export type MyPageUser = {
    id:     number;
    name:   string;
    email:  string;
    role:   string;
}

// マイページ表示用ペット　→　後で移動
export type MyPagePet = {
    id :        number;
    userId:     number;
    name:       string;
    type:       string;
    sex:        string;
    birthDate:  string;
}

// マイページ取得レスポンス
export type MyPageData = {
    user: MyPageUser;
    pets: MyPagePet[];
}
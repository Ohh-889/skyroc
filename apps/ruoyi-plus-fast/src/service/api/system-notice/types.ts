export type NoticeId = number | string;

export type NoticeStatus = '0' | '1';

export type NoticeType = '1' | '2';

export interface NoticeItem {
  createBy: null | NoticeId;
  createByName: string;
  createTime: null | string;
  noticeContent: null | string;
  noticeId: NoticeId;
  noticeTitle: string;
  noticeType: NoticeType;
  remark: null | string;
  status: NoticeStatus;
}

export interface NoticeListPage {
  current: number;
  records: NoticeItem[];
  size: number;
  total: number;
}

export interface NoticeListParams {
  beginTime?: string;
  createByName?: string;
  current: number;
  endTime?: string;
  noticeTitle?: string;
  noticeType?: NoticeType;
  size: number;
  status?: NoticeStatus;
}

export interface NoticeSavePayload {
  noticeContent?: null | string;
  noticeTitle: string;
  noticeType: NoticeType;
  remark?: null | string;
  status: NoticeStatus;
}

export interface NoticeUpdatePayload extends NoticeSavePayload {
  noticeId: NoticeId;
}

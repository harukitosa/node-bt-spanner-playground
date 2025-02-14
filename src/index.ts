import { Bigtable } from '@google-cloud/bigtable';

async function runSample() {
  // Bigtable クライアントを初期化
  const bigtable = new Bigtable();

  // Emulator では任意のインスタンス名を使用します（インスタンス管理はできないので、存在確認も不要）
  const instanceId = 'my-instance';
  const tableId = 'sample-table';
  const instance = bigtable.instance(instanceId);
  const table = instance.table(tableId);

  // テーブル作成（既に存在する場合はエラーになるので、その場合はスキップ）
  try {
    console.log(`テーブル ${tableId} を作成します...`);
    await table.create({
      families: ['cf1'], // カラムファミリー cf1 を作成
    });
    console.log('テーブル作成完了。');
  } catch (err: any) {
    // ALREADY_EXISTS エラーの場合は既存テーブルとして続行
    if (err.code === 6) {
      console.log('テーブルは既に存在しています。');
    } else {
      console.error('テーブル作成中にエラーが発生しました:', err);
      return;
    }
  }

  // ランダムな rowKey と rowData の生成
  const rowKey = `row-${Math.random().toString(36).substring(2, 10)}`;
  const randomGreeting = `Hello ${Math.random().toString(36).substring(2, 8)}!`;
  const rowData = {
    cf1: {
      greeting: randomGreeting,
    },
  };
  // 行の挿入
  try {
    console.log(`行 ${rowKey} を挿入します...`);
    await table.insert({
      key: rowKey,
      data: rowData,
    });
    console.log('行の挿入完了。');
  } catch (err) {
    console.error('行挿入中にエラーが発生しました:', err);
    return;
  }

  // 挿入した行の読み出し
  try {
    console.log(`行 ${rowKey} を読み出します...`);
    const [row] = await table.row(rowKey).get();
    console.log('取得した行のデータ:', JSON.stringify(row.data, null, 2));
  } catch (err) {
    console.error('行読み出し中にエラーが発生しました:', err);
  }
}

runSample().catch(console.error);

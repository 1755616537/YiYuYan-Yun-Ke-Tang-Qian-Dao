<?php
header('Content-type: text/html; charset=UTF8');
$tsxxgs="提示:";//提示信息格式
$cwxxgs="错误:";//错误信息格式
$jl_lx=$_POST["lx"];//记录类型
$jl_xh=$_POST["xh"];//学号
$jl_ip=$_POST["ip"];//ip
$jl_gj=$_POST["gj"];//国家
$jl_sf=$_POST["sf"];//省份
$jl_cs=$_POST["cs"];//城市
$jl_yys=$_POST["yys"];//运营商
$jl_yzbm=$_POST["yzbm"];//邮政编码
$jl_dqqh=$_POST["dqqh"];//地区区号
if (empty($jl_lx)==1) {
	exit($cwxxgs."错误类型");
}
if (empty($jl_xh)==1) {
	exit($cwxxgs."缺少学号参数");
}
if (empty($jl_ip)==1) {
	exit($cwxxgs."缺少ip参数");
}
if (empty($jl_gj)==1) {
	exit($cwxxgs."缺少国家参数");
}
if (empty($jl_sf)==1) {
	exit($cwxxgs."缺少省份参数");
}
if (empty($jl_cs)==1) {
	exit($cwxxgs."缺少城市参数");
}
if (empty($jl_yys)==1) {
	exit($cwxxgs."缺少运营商参数");
}
if (empty($jl_yzbm)==1) {
	exit($cwxxgs."缺少邮政编码参数");
}
if (empty($jl_dqqh)==1) {
	exit($cwxxgs."缺少地区区号参数");
}

//连接数据库
$conn = mysql_connect("b-ldkhqhgpknymw3.bch.rds.hkg.baidubce.com:3306","b_ldkhqhgpknymw3","hgpknymw3");
if (!$conn)
  {
  die($cwxxgs.mysql_error($conn));
  }
mysql_select_db("b_ldkhqhgpknymw3", $conn);//设置数据库
//$sql = "SELECT * FROM xiaogongju WHERE xh='".$jl_xh."'";
$sql = "SELECT * FROM `xiaogongju` WHERE `lx` LIKE '".$jl_lx."' AND `xh` LIKE '".$jl_xh."' AND `ip` LIKE '".$jl_ip."'";
$result = mysql_query($sql);//查询
if(!$result)
{
    die($cwxxgs.mysql_error($conn));
}

while($row = mysql_fetch_array($result))
  {
/*
  echo $row['lx'] . " " . $row['xh'] . " " . $row['ip'] . " " . $row['gj'] . " " . $row['sf'] . " " . $row['cs'] . " " . $row['yys'] . " " . $row['yzbm'] . " " . $row['dqqh'] . " " . $row['zcs'];
  echo "<br/>";
*/
  $zcs=$row['zcs'];
  }
//echo "查询到的总数:".count($row);
if (count($row,0)<=0 || empty($zcs)==1) {
	$jl_bma=mb_detect_encoding($jl_lx, array("ASCII",'UTF-8',"GB2312","GBK",'BIG5'));
	if ($jl_bma!="UTF-8") {
		$jl_lx= iconv($jl_bma,"UTF-8",$jl_lx);
	}
	$jl_bma=mb_detect_encoding($jl_xh, array("ASCII",'UTF-8',"GB2312","GBK",'BIG5'));
	if ($jl_bma!="UTF-8") {
		$jl_xh= iconv($jl_bma,"UTF-8",$jl_xh);
	}
	$jl_bma=mb_detect_encoding($jl_ip, array("ASCII",'UTF-8',"GB2312","GBK",'BIG5'));
	if ($jl_bma!="UTF-8") {
		$jl_ip= iconv($jl_bma,"UTF-8",$jl_ip);
	}
	$jl_bma=mb_detect_encoding($jl_gj, array("ASCII",'UTF-8',"GB2312","GBK",'BIG5'));
	if ($jl_bma!="UTF-8") {
		$jl_gj= iconv($jl_bma,"UTF-8",$jl_gj);
	}
	$jl_bma=mb_detect_encoding($jl_sf, array("ASCII",'UTF-8',"GB2312","GBK",'BIG5'));
	if ($jl_bma!="UTF-8") {
		$jl_sf= iconv($jl_bma,"UTF-8",$jl_sf);
	}
	$jl_bma=mb_detect_encoding($jl_cs, array("ASCII",'UTF-8',"GB2312","GBK",'BIG5'));
	if ($jl_bma!="UTF-8") {
		$jl_cs= iconv($jl_bma,"UTF-8",$jl_cs);
	}
	$jl_bma=mb_detect_encoding($jl_yys, array("ASCII",'UTF-8',"GB2312","GBK",'BIG5'));
	if ($jl_bma!="UTF-8") {
		$jl_yys= iconv($jl_bma,"UTF-8",$jl_yys);
	}
	$jl_bma=mb_detect_encoding($jl_yzbm, array("ASCII",'UTF-8',"GB2312","GBK",'BIG5'));
	if ($jl_bma!="UTF-8") {
		$jl_yzbm= iconv($jl_bma,"UTF-8",$jl_yzbm );
	}
	$jl_bma=mb_detect_encoding($jl_dqqh, array("ASCII",'UTF-8',"GB2312","GBK",'BIG5'));
	if ($jl_bma!="UTF-8") {
		$jl_dqqh= iconv($jl_bma,"UTF-8",$jl_dqqh);
	}	
	$sql = "INSERT INTO `b_ldkhqhgpknymw3`.`xiaogongju` (`lx`, `xh`, `ip`, `gj`, `sf`, `cs`, `yys`, `yzbm`, `dqqh`, `zcs`) VALUES ('".$jl_lx."', '".$jl_xh."', '".$jl_ip."', '".$jl_gj."', '".$jl_sf."', '".$jl_cs."', '".$jl_yys."', '".$jl_yzbm."', '".$jl_dqqh."', '1')";
	$result = mysql_query($sql);//插入
	if(!$result)
	{
    	die($cwxxgs.mysql_error($conn));
	}
}else{
if (count($row)!=1) {
	die($cwxxgs."数据错误");
}
$zcs++;
//echo("总次数:".$zcs);
$sql = "UPDATE `xiaogongju` SET zcs=".$zcs." WHERE `lx` LIKE '".$jl_lx."' AND `xh` LIKE '".$jl_xh."' AND `ip` LIKE '".$jl_ip."'";
$result = mysql_query($sql);//更新
if(!$result)
{
    die($cwxxgs.mysql_error($conn));
}
}
die($tsxxgs."成功");
mysql_free_result($result);//释放内存
mysql_close($conn);//关闭数据库连接

/*function send_post_get($url,$lx, $post_data) {
	$postdata = http_build_query($post_data);
  	$options = array(
   		'http' => array(
     	'method' => $lx,
     	'header' => 'Content-type:application/x-www-form-urlencoded',
    	 'content' => $postdata,
     	'timeout' => 15 * 60 // 超时时间（单位:s）
    )
  );
  $context = stream_context_create($options);
  $result = file_get_contents($url, false, $context);
  return $result;
}
function getSubstr($str, $leftStr, $rightStr)
{
    $left = strpos($str, $leftStr);
    //echo '左边:'.$left;
    $right = strpos($str, $rightStr,$left);
    //echo '<br>右边:'.$right;
    if($left < 0 or $right < $left) return '';
    return substr($str, $left + strlen($leftStr), $right-$left-strlen($leftStr));
}
//$post_data = array(
//  'username' => 'stclair2201',
//  'password' => 'handan'
//);
$post_data = array();
$token="8e69615bedacec0ebc4547d35828a4fe";
$fhjg_result=send_post_get('http://api.ip138.com/query/?ip=&datatype=txt&callback=find&token='.$token,'GET',$post_data);

$fhjg_result_arr=explode(' ',$fhjg_result);
echo(count($fhjg_result_arr,0));
if (count($fhjg_result_arr,0)!=6) {
	die($cwxxgs."取用户信息失败");
}
$fhjg_result_ip_sz=explode('	', $fhjg_result_arr[0]);
if (count($fhjg_result_ip_sz,0)!=2) {
	die($cwxxgs."取用户信息失败2");
}

$fhjg_result_ip=$fhjg_result_ip_sz[0];//ip
$fhjg_result_gj=$fhjg_result_ip_sz[1];//国家
$fhjg_result_sh=$fhjg_result_arr[1];//省会或直辖市
$fhjg_result_dq=$fhjg_result_arr[2];//地区或城市
$fhjg_result_yxs=$fhjg_result_arr[3];//运营商
$fhjg_result_yzbm=$fhjg_result_arr[4];//邮政编码
$fhjg_result_dqqh=$fhjg_result_arr[5];//地区区号
if (empty($fhjg_result_ip)==1 || empty($fhjg_result_gj)==1 || empty($fhjg_result_sh)==1 || empty($fhjg_result_dq)==1 || empty($fhjg_result_yxs)==1 || empty($fhjg_result_yzbm)==1 || empty($fhjg_result_dqqh)==1) {
	die($cwxxgs."取用户信息失败3");
}
print_r($fhjg_result_arr);
print_r($fhjg_result_ip_sz);*/
?>
<?php

class sqsuser
{
    private $dbconn;

    public function __construct()
    {
    //here to connect the database in the computer
        $dbURI = 'mysql:host=' . 'localhost' . ';port=3307;dbname=' . 'proj2';
        $this->dbconn = new PDO($dbURI, 'root', '');
        $this->dbconn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    function checkLogin($u, $p)
    {
    // Return uid if user/password tendered are correct otherwise 0
        $sql = "SELECT * FROM customer WHERE username = :username";
        $stmt = $this->dbconn->prepare($sql);
        $stmt->bindParam(':username', $u, PDO::PARAM_STR);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            $retVal = $stmt->fetch(PDO::FETCH_ASSOC);
            if (strlen($retVal['password']) > 0) {
                //only usertype is admin can login admin panel
                if ($retVal['password'] ==MD5($p) && $retVal['usertype'] == 'admin') { 
                    return array(
                        'CustomerID' => $retVal['CustomerID'],
                        'username' => $retVal['username'],
                        'email' => $retVal['email'],
                        'phone' => $retVal['phone'],
                        'postcode' => $retVal['postcode'],
                        'usertype' => $retVal['usertype']
                    );
                } else {
                    return false;
                }
            } else {
                return array('username' => $retVal['username']);
            }
        } else {
            return false;
        }
    }
    function userExists($u)
    {
        $sql = "SELECT * FROM customer WHERE username = :username";
        $stmt = $this->dbconn->prepare($sql);
        $stmt->bindParam(':username', $u, PDO::PARAM_STR);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            return true;
        } else {
            return false;
        }
    }
    function userid($c)
    {
        $sql = "SELECT CustomerID FROM customer WHERE username = :username";
        $stmt = $this->dbconn->prepare($sql);
        $stmt->bindParam(':username', $c, PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetchAll();
        return $result;
    }
    function registerUser( $username, $email, $phone, $postcode, $password)
    {
      
        $sql = "INSERT INTO customer (username,email,phone,postcode,password,usertype)  
        VALUES (:username,:email, :phone,:postcode,MD5(:password),'admin');";
        $stmt = $this->dbconn->prepare($sql);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':phone', $phone, PDO::PARAM_INT);
        $stmt->bindParam(':postcode', $postcode, PDO::PARAM_INT);
        $stmt->bindParam(':password', $password, PDO::PARAM_STR);
        $result = $stmt->execute();
        if ($result === true) {
            return true;
        } else {
            return false;
        }
    }
    function updateprofile($CustomerID, $username, $email, $phone, $postcode, $password)
    {
        $sql = "UPDATE customer SET username = :username,password = :password , email = :email, phone = :phone, postcode = :postcode WHERE  CustomerID= :CustomerID";
        $stmt = $this->dbconn->prepare($sql);
        $stmt->bindParam(':CustomerID', $CustomerID, PDO::PARAM_INT);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->bindParam(':password', $password, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':phone', $phone, PDO::PARAM_INT);
        $stmt->bindParam(':postcode', $postcode, PDO::PARAM_INT);
        $result = $stmt->execute();
        if ($result === true) {
            return true;
        } else {
            return false;
        }
    }
    function logevent($CustomerID,$action)
    {
        $ip = $_SERVER['REMOTE_ADDR'];     
        $sql = "INSERT INTO logtable ( CustomerID ,ip_addr, action ,usertype) 
                VALUES (:CustomerID,:ip,:action,'admin');";
        $stmt = $this->dbconn->prepare($sql);
        $stmt->bindParam(':CustomerID', $CustomerID, PDO::PARAM_INT);
     
        $stmt->bindParam(':action', $action, PDO::PARAM_STR);
        $stmt->bindParam(':ip',  $ip , PDO::PARAM_INT);
        $result = $stmt->execute();
        if ($result === true) {
            return true;
        } else {
            return false;
        }
    }
    function displayorderfood()
    {

        $sql = "SELECT * FROM food";
        $stmt = $this->dbconn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll();
        exit(json_encode($result));
    }
    function sumtotalpriceff($CustomerID)
    {
        $sql = "UPDATE orderform SET orderform.totalprice = (SELECT SUM(orderitem.totalprice) FROM orderitem  WHERE orderitem.orderID = (SELECT max(orderID) orderID FROM orderform where CustomerID= :CustomerID ))
            WHERE orderform.orderID= (SELECT max(orderID) orderID FROM orderform where CustomerID= :CustomerID );";
        $stmt = $this->dbconn->prepare($sql);
        $stmt->bindParam(':CustomerID', $CustomerID, PDO::PARAM_INT);
        $result = $stmt->execute();
        if ($result === true) {
            return true;
        } else {
            return false;
        }
    }
    function displayshoworderform($CustomerID)
    {
        $sql = "SELECT * FROM orderitem where orderID=(SELECT max(orderID) orderID FROM orderform where CustomerID= :CustomerID );";
        $stmt = $this->dbconn->prepare($sql);
        $stmt->bindParam(':CustomerID', $CustomerID, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetchAll();
        exit(json_encode($result));
    }
    function deleteorderfood($orderitem_ID)
    {
        $sql = "DELETE FROM orderitem where orderitem_ID = :orderitem_ID;";
        $stmt = $this->dbconn->prepare($sql);
        $stmt->bindParam(':orderitem_ID', $orderitem_ID, PDO::PARAM_INT);
        $result = $stmt->execute();
        if ($result === true) {
            return true;
        } else {
            return false;
        }
    }

    function getorderID($CustomerID)
    {
        $sql = "SELECT max(orderID)  orderID FROM orderform where CustomerID=:CustomerID ";
        $stmt = $this->dbconn->prepare($sql);
        $stmt->bindParam(':CustomerID', $CustomerID, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetchAll();
        exit(json_encode($result));
    }
    function displayfood()
    {
        /*$dbhost = 'localhost:3307';
            $dbuser = 'root';
            $dbpass = '';
            $db     = 'proj2';*/

        $sql = "SELECT * FROM food";
        $stmt = $this->dbconn->prepare($sql);
        $stmt->execute();
        //$conn  = mysqli_connect($dbhost,$dbuser,'',$db);
        $result = $stmt->fetchAll();
        //$sql=mysqli_query($conn,"SELECT * FROM food");
        //$result=mysqli_fetch_all($sql,MYSQLI_ASSOC);

        exit(json_encode($result));
    }
    function addfooditem($foodname, $price, $description, $options, $image)
    {

        $sql = "INSERT INTO food (foodname,price,description,options,image)  VALUES (:foodname,:price,:description,:options,:image);";
        $stmt = $this->dbconn->prepare($sql);
        //  $stmt->bindParam(':F_ID', $F_ID, PDO::PARAM_INT);   
        $stmt->bindParam(':foodname', $foodname, PDO::PARAM_STR);
        $stmt->bindParam(':price', $price, PDO::PARAM_INT);
        $stmt->bindParam(':description', $description, PDO::PARAM_STR);
        $stmt->bindParam(':options', $options, PDO::PARAM_STR);
        $stmt->bindParam(':image', $image, PDO::PARAM_STR);
        $result = $stmt->execute();
        if ($result === true) {
            return true;
        } else {
            return false;
        }
    }
    function deletefood($F_ID)
    {
        $sql = "DELETE FROM food where F_ID = :F_ID;";
        $stmt = $this->dbconn->prepare($sql);
        $stmt->bindParam(':F_ID',$F_ID, PDO::PARAM_INT);
        $result = $stmt->execute();
        if ($result === true) {
            return true;
        } else {
            return false;
        }
    }
    function updatefooditem($F_ID, $foodname, $price, $description, $options, $image)
    {

        $sql = "UPDATE food SET foodname = :foodname,price = :price , description = :description, options = :options, image = :image WHERE F_ID = :F_ID";
        $stmt = $this->dbconn->prepare($sql);
        $stmt->bindParam(':F_ID', $F_ID, PDO::PARAM_INT);
        $stmt->bindParam(':foodname', $foodname, PDO::PARAM_STR);
        $stmt->bindParam(':price', $price, PDO::PARAM_INT);
        $stmt->bindParam(':description', $description, PDO::PARAM_STR);
        $stmt->bindParam(':options', $options, PDO::PARAM_STR);
        $stmt->bindParam(':image', $image, PDO::PARAM_STR);
        $result = $stmt->execute();
        if ($result === true) {
            return true;
        } else {
            return false;
        }
    }
    function createorderform($CustomerID)
    {
        $sql = "INSERT INTO orderform (orderstatus,CustomerID,totalprice)  VALUES ('Notpayed',:CustomerID,'0');";
        $stmt = $this->dbconn->prepare($sql);
        // $stmt->bindParam(':orderstatus', $orderstatus, PDO::PARAM_STR);
        $stmt->bindParam(':CustomerID', $CustomerID, PDO::PARAM_INT);
        // $stmt->bindParam(':totalprice', $totalprice, PDO::PARAM_INT);   
        $result = $stmt->execute();
        if ($result === true) {
            return true;
        } else {
            return false;
        }
    }
    function orderquantityfood($F_ID, $foodname, $price, $quantity, $totalprice, $CustomerID)
    {

        $sql = "INSERT INTO orderitem (F_ID,foodname,price,quantity,totalprice,orderID)  VALUES (:F_ID,:foodname,:price,:quantity,:totalprice,(SELECT max(orderID) orderID FROM orderform where CustomerID= :CustomerID ));";
        $stmt = $this->dbconn->prepare($sql);
        //  $stmt->bindParam(':F_ID', $F_ID, PDO::PARAM_INT);  
        $stmt->bindParam(':F_ID', $F_ID, PDO::PARAM_INT);
        $stmt->bindParam(':foodname', $foodname, PDO::PARAM_STR);
        $stmt->bindParam(':price', $price, PDO::PARAM_INT);
        $stmt->bindParam(':quantity', $quantity, PDO::PARAM_INT);
        $stmt->bindParam(':totalprice', $totalprice, PDO::PARAM_INT);
        $stmt->bindParam(':CustomerID', $CustomerID, PDO::PARAM_INT);
        $result = $stmt->execute();
        if ($result === true) {
            return true;
        } else {
            return false;
        }
    }
    function getconfirmorderform($CustomerID)
    {
        $sql = "SELECT * FROM orderform where orderID=(SELECT max(orderID) FROM orderform where CustomerID=:CustomerID)";
        $stmt = $this->dbconn->prepare($sql);
        $stmt->bindParam(':CustomerID', $CustomerID, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetchAll();
        exit(json_encode($result));
    }
    function checkoutff($CustomerID, $cname, $ccnum, $expmonth, $expyear, $cvv)
    {

        $sql = "INSERT INTO payment (CustomerID,cname,ccnum,expmonth,expyear,cvv)  VALUES (:CustomerID,:cname,:ccnum,:expmonth,:expyear,:cvv);";
        $stmt = $this->dbconn->prepare($sql);
        $stmt->bindParam(':CustomerID', $CustomerID, PDO::PARAM_INT);
        $stmt->bindParam(':cname', $cname, PDO::PARAM_STR);
        $stmt->bindParam(':ccnum', $ccnum, PDO::PARAM_INT);
        $stmt->bindParam(':expmonth', $expmonth, PDO::PARAM_STR);
        $stmt->bindParam(':expyear', $expyear, PDO::PARAM_INT);
        $stmt->bindParam(':cvv', $cvv, PDO::PARAM_INT);
        $result = $stmt->execute();
        if ($result === true) {
            return true;
        } else {
            return false;
        }
    }


    function checkoutupdateff($CustomerID)
    {
        $sql = "UPDATE orderform SET orderform.orderstatus = 'completepayment' WHERE orderform.orderID= (SELECT max(orderID) orderID FROM orderform where CustomerID= :CustomerID );";
        $stmt = $this->dbconn->prepare($sql);
        $stmt->bindParam(':CustomerID', $CustomerID, PDO::PARAM_INT);
        $result = $stmt->execute();
        if ($result === true) {
            return true;
        } else {
            return false;
        }
    }


//============================ Control user function===================================

function userdisplay()
{
    $sql = "SELECT * FROM customer WHERE usertype ='user'";
    $stmt = $this->dbconn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll();
        exit(json_encode($result));
}
function useradd($username, $email, $phone, $postcode, $password,$usertype)
{
    $sql = "INSERT INTO customer (username,email,phone,postcode,password,usertype)  VALUES (:username,:email, :phone,:postcode,:password,:usertype);";
        $stmt = $this->dbconn->prepare($sql);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':phone', $phone, PDO::PARAM_INT);
        $stmt->bindParam(':postcode', $postcode, PDO::PARAM_INT);
        $stmt->bindParam(':password', $password, PDO::PARAM_STR);
        $stmt->bindParam(':usertype', $usertype, PDO::PARAM_STR);
        $result = $stmt->execute();
        if ($result === true) {
            return true;
        } else {
            return false;
        }
}
function userdelete($CustomerID)
{
    $sql = "DELETE FROM customer where CustomerID = :CustomerID;";
    $stmt = $this->dbconn->prepare($sql);
    $stmt->bindParam(':CustomerID', $CustomerID, PDO::PARAM_INT);
    $result = $stmt->execute();
    if ($result === true) {
        return true;
    } else {
        return false;
    }
}
function userupdate($CustomerID, $username, $email, $phone, $postcode, $password,$usertype)
{
    $sql = "UPDATE customer SET username = :username,password = :password , email = :email, phone = :phone, postcode = :postcode ,usertype=:usertype WHERE CustomerID = :CustomerID";
        $stmt = $this->dbconn->prepare($sql);
        $stmt->bindParam(':CustomerID', $CustomerID, PDO::PARAM_INT);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->bindParam(':password', $password, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':phone', $phone, PDO::PARAM_INT);
        $stmt->bindParam(':postcode', $postcode, PDO::PARAM_INT);
        $stmt->bindParam(':usertype', $usertype, PDO::PARAM_STR);
        $result = $stmt->execute();
        if ($result === true) {
            return true;
        } else {
            return false;
        }
}
}

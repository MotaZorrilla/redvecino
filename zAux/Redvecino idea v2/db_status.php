<?php
header('Content-Type: text/plain');
try {
    $db = new PDO("sqlite:egresos.db");
    $res = $db->query("SELECT sql FROM sqlite_master WHERE type='table' AND name='pedidos_insumos'");
    echo "SCHEMA:\n";
    print_r($res->fetchAll(PDO::FETCH_ASSOC));

    $res2 = $db->query("SELECT * FROM pedidos_insumos");
    echo "\nRECORDS:\n";
    print_r($res2->fetchAll(PDO::FETCH_ASSOC));
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
?>

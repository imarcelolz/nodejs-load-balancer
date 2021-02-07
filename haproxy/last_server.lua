function last_server(txn)
  core.Alert("last_server");
  return '1234'
end

core.register_fetches("last_server", last_server)

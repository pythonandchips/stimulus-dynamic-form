#frozen_string_literal: true

class Payment
  include ActiveModel::Model

  attr_accessor :role, :first_name, :last_name, :contact_number, :approved, :department
end

package com.asp5640.fullstack_backend.repository;

import com.asp5640.fullstack_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long>{

}
